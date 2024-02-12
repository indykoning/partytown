import '../types';
import { debug, getConstructorName, isPromise, len } from '../utils';
import { defineCustomElement } from './main-custom-element';
import { deserializeFromWorker, serializeForWorker } from './main-serialization';
import { getInstance, setInstanceId } from './main-instances';
import { normalizedWinId } from '../log';
import { winCtxs } from './main-constants';
export const mainAccessHandler = async (worker, accessReq) => {
    let accessRsp = {
        $msgId$: accessReq.$msgId$,
    };
    let totalTasks = len(accessReq.$tasks$);
    let i = 0;
    let task;
    let winId;
    let applyPath;
    let instance;
    let rtnValue;
    let isLast;
    for (; i < totalTasks; i++) {
        try {
            isLast = i === totalTasks - 1;
            task = accessReq.$tasks$[i];
            winId = task.$winId$;
            applyPath = task.$applyPath$;
            if (!winCtxs[winId] && winId.startsWith('f_')) {
                // window (iframe) hasn't finished loading yet
                await new Promise((resolve) => {
                    let check = 0;
                    let callback = () => {
                        if (winCtxs[winId] || check++ > 1000) {
                            resolve();
                        }
                        else {
                            requestAnimationFrame(callback);
                        }
                    };
                    callback();
                });
            }
            if (applyPath[0] === 1 /* ApplyPathType.GlobalConstructor */ &&
                applyPath[1] in winCtxs[winId].$window$) {
                setInstanceId(new winCtxs[winId].$window$[applyPath[1]](...deserializeFromWorker(worker, applyPath[2])), task.$instanceId$);
            }
            else {
                // get the existing instance
                instance = getInstance(winId, task.$instanceId$);
                if (instance) {
                    rtnValue = applyToInstance(worker, winId, instance, applyPath, isLast, task.$groupedGetters$);
                    if (task.$assignInstanceId$) {
                        if (typeof task.$assignInstanceId$ === 'string') {
                            setInstanceId(rtnValue, task.$assignInstanceId$);
                        }
                        else {
                            winCtxs[task.$assignInstanceId$.$winId$] = {
                                $winId$: task.$assignInstanceId$.$winId$,
                                $window$: {
                                    document: rtnValue,
                                },
                            };
                        }
                    }
                    if (isPromise(rtnValue)) {
                        rtnValue = await rtnValue;
                        if (isLast) {
                            accessRsp.$isPromise$ = true;
                        }
                    }
                    if (isLast) {
                        accessRsp.$rtnValue$ = serializeForWorker(winId, rtnValue, undefined, undefined, undefined, task.$instanceId$);
                    }
                }
                else {
                    if (debug) {
                        accessRsp.$error$ = `Error finding instance "${task.$instanceId$}" on window ${normalizedWinId(winId)}`;
                        console.error(accessRsp.$error$, task);
                    }
                    else {
                        accessRsp.$error$ = task.$instanceId$ + ' not found';
                    }
                }
            }
        }
        catch (e) {
            if (isLast) {
                // last task is the only one we can throw a sync error
                accessRsp.$error$ = String(e.stack || e);
            }
            else {
                // this is an error from an async setter, but we're
                // not able to throw a sync error, just console.error
                console.error(e);
            }
        }
    }
    return accessRsp;
};
const applyToInstance = (worker, winId, instance, applyPath, isLast, groupedGetters) => {
    let i = 0;
    let l = len(applyPath);
    let next;
    let current;
    let previous;
    let args;
    let groupedRtnValues;
    for (; i < l; i++) {
        current = applyPath[i];
        next = applyPath[i + 1];
        previous = applyPath[i - 1];
        try {
            if (!Array.isArray(next)) {
                if (typeof current === 'string' || typeof current === 'number') {
                    // getter
                    if (i + 1 === l && groupedGetters) {
                        // instead of getting one property, we actually want to get many properties
                        // This is useful for getting all dimensions of an element in one call
                        groupedRtnValues = {};
                        groupedGetters.map((propName) => (groupedRtnValues[propName] = instance[propName]));
                        return groupedRtnValues;
                    }
                    // current is the member name, but not a method
                    instance = instance[current];
                }
                else if (next === 0 /* ApplyPathType.SetValue */) {
                    // setter
                    // previous is the setter name
                    // current is the setter value
                    // next tells us this was a setter
                    instance[previous] = deserializeFromWorker(worker, current);
                    // setters never return a value
                    return;
                }
                else if (typeof instance[previous] === 'function') {
                    // method call
                    // current is the method args
                    // previous is the method name
                    args = deserializeFromWorker(worker, current);
                    if (previous === 'define' && getConstructorName(instance) === 'CustomElementRegistry') {
                        args[1] = defineCustomElement(winId, worker, args[1]);
                    }
                    if (previous === 'insertRule') {
                        // possible that the async insertRule has thrown an error
                        // and the subsequent async insertRule's have bad indexes
                        if (args[1] > len(instance.cssRules)) {
                            args[1] = len(instance.cssRules);
                        }
                    }
                    instance = instance[previous].apply(instance, args);
                    if (previous === 'play') {
                        return Promise.resolve();
                    }
                }
            }
        }
        catch (err) {
            if (isLast) {
                throw err;
            }
            else {
                if (debug) {
                    console.debug(`Non-blocking setter error:`, err);
                }
                else {
                    console.debug(err);
                }
            }
        }
    }
    return instance;
};
