import { CreatedKey, InstanceIdKey, instances, winCtxs, windowIds } from './main-constants';
import '../types';
import { randomId } from '../utils';
export const getAndSetInstanceId = (instance, instanceId) => {
    if (instance) {
        if ((instanceId = windowIds.get(instance))) {
            return instanceId;
        }
        if (!(instanceId = instance[InstanceIdKey])) {
            setInstanceId(instance, (instanceId = randomId()));
        }
        return instanceId;
    }
};
export const getInstance = (winId, instanceId, win, doc, docId) => {
    if ((win = winCtxs[winId]) && win.$window$) {
        if (winId === instanceId) {
            return win.$window$;
        }
        doc = win.$window$.document;
        docId = instanceId.split('.').pop();
        if (docId === "d" /* document */) {
            return doc;
        }
        if (docId === "e" /* documentElement */) {
            return doc.documentElement;
        }
        if (docId === "h" /* head */) {
            return doc.head;
        }
        if (docId === "b" /* body */) {
            return doc.body;
        }
    }
    return instances.get(instanceId);
};
export const setInstanceId = (instance, instanceId, now) => {
    if (instance) {
        instances.set(instanceId, instance);
        instance[InstanceIdKey] = instanceId;
        instance[CreatedKey] = now = Date.now();
        if (now > lastCleanup + 5000) {
            instances.forEach((storedInstance, instanceId) => {
                if (storedInstance[CreatedKey] < lastCleanup) {
                    if (storedInstance.nodeType && !storedInstance.isConnected) {
                        instances.delete(instanceId);
                    }
                }
            });
            lastCleanup = now;
        }
    }
};
let lastCleanup = 0;
