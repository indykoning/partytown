import '../types';
import { callMethod } from './worker-proxy';
import { environments, InstanceIdKey, postMessages, webWorkerRefIdsByRef, webWorkerRefsByRefId, WinIdKey, } from './worker-constants';
import { defineConstructorName, getConstructorName, len, noop } from '../utils';
import { getOrCreateNodeInstance } from './worker-constructors';
import { setWorkerRef } from './worker-state';
export const serializeForMain = ($winId$, $instanceId$, value, added, type) => {
    if (value !== undefined && (type = typeof value)) {
        if (type === 'string' || type === 'boolean' || type === 'number' || value == null) {
            return [0 /* SerializedType.Primitive */, value];
        }
        else if (type === 'function') {
            return [
                4 /* SerializedType.Ref */,
                {
                    $winId$,
                    $instanceId$,
                    $refId$: setWorkerRef(value),
                },
            ];
        }
        else if ((added = added || new Set()) && Array.isArray(value)) {
            if (added.has(value)) {
                return [1 /* SerializedType.Array */, []];
            }
            else {
                return (added.add(value) && [
                    1 /* SerializedType.Array */,
                    value.map((v) => serializeForMain($winId$, $instanceId$, v, added)),
                ]);
            }
        }
        else if (type === 'object') {
            if (value[InstanceIdKey]) {
                return [3 /* SerializedType.Instance */, [value[WinIdKey], value[InstanceIdKey]]];
            }
            else if (value instanceof Event) {
                return [
                    5 /* SerializedType.Event */,
                    serializeObjectForMain($winId$, $instanceId$, value, false, added),
                ];
            }
            else if (supportsTrustedHTML && value instanceof TrustedHTML) {
                // https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API
                return [0 /* SerializedType.Primitive */, value.toString()];
            }
            else if (value instanceof ArrayBuffer) {
                return [8 /* SerializedType.ArrayBuffer */, value];
            }
            else if (ArrayBuffer.isView(value)) {
                return [9 /* SerializedType.ArrayBufferView */, value.buffer, getConstructorName(value)];
            }
            else {
                return [
                    2 /* SerializedType.Object */,
                    serializeObjectForMain($winId$, $instanceId$, value, true, added),
                ];
            }
        }
        else {
            return;
        }
    }
    else {
        return value;
    }
};
const supportsTrustedHTML = typeof TrustedHTML !== 'undefined';
const serializeObjectForMain = (winId, instanceId, obj, includeFunctions, added, serializedObj, propName, propValue) => {
    serializedObj = {};
    if (!added.has(obj)) {
        added.add(obj);
        for (propName in obj) {
            propValue = obj[propName];
            if (includeFunctions || typeof propValue !== 'function') {
                serializedObj[propName] = serializeForMain(winId, instanceId, propValue, added);
            }
        }
    }
    return serializedObj;
};
export const serializeInstanceForMain = (instance, value) => instance
    ? serializeForMain(instance[WinIdKey], instance[InstanceIdKey], value)
    : [0 /* SerializedType.Primitive */, value];
export const deserializeFromMain = (winId, instanceId, applyPath, serializedValueTransfer, serializedType, serializedValue, obj, key) => {
    if (serializedValueTransfer) {
        serializedType = serializedValueTransfer[0];
        serializedValue = serializedValueTransfer[1];
        if (serializedType === 0 /* SerializedType.Primitive */ ||
            serializedType === 11 /* SerializedType.CSSRule */ ||
            serializedType === 12 /* SerializedType.CSSRuleList */) {
            return serializedValue;
        }
        if (serializedType === 4 /* SerializedType.Ref */) {
            return deserializeRefFromMain(applyPath, serializedValue);
        }
        if (serializedType === 6 /* SerializedType.Function */) {
            if (winId && applyPath.length > 0) {
                return (...args) => callMethod(environments[winId].$window$, applyPath, args, 1 /* CallType.Blocking */);
            }
            return noop;
        }
        if (serializedType === 3 /* SerializedType.Instance */) {
            return getOrCreateSerializedInstance(serializedValue);
        }
        if (serializedType === 7 /* SerializedType.NodeList */) {
            return new NodeList(serializedValue.map(getOrCreateSerializedInstance));
        }
        if (serializedType === 10 /* SerializedType.Attr */) {
            return new Attr(serializedValue);
        }
        if (serializedType === 1 /* SerializedType.Array */) {
            return serializedValue.map((v) => deserializeFromMain(winId, instanceId, applyPath, v));
        }
        if (serializedType === 14 /* SerializedType.Error */) {
            return new CustomError(serializedValue);
        }
        obj = {};
        for (key in serializedValue) {
            obj[key] = deserializeFromMain(winId, instanceId, [...applyPath, key], serializedValue[key]);
        }
        if (serializedType === 13 /* SerializedType.CSSStyleDeclaration */) {
            return new environments[winId].$window$.CSSStyleDeclaration(winId, instanceId, applyPath, obj);
        }
        if (serializedType === 5 /* SerializedType.Event */) {
            if (obj.type === 'message' && obj.origin) {
                let postMessageKey = JSON.stringify(obj.data);
                let postMessageData = postMessages.find((pm) => pm.$data$ === postMessageKey);
                let env;
                if (postMessageData) {
                    env = environments[postMessageData.$winId$];
                    if (env) {
                        obj.source = env.$window$;
                        obj.origin = env.$location$.origin;
                    }
                }
            }
            return new Proxy(new Event(obj.type, obj), {
                get: (target, propName) => {
                    if (propName in obj) {
                        return obj[propName];
                    }
                    else if (typeof target[String(propName)] === 'function') {
                        return noop;
                    }
                    else {
                        return target[String(propName)];
                    }
                },
            });
        }
        if (serializedType === 2 /* SerializedType.Object */) {
            return obj;
        }
    }
};
export const getOrCreateSerializedInstance = ([winId, instanceId, nodeName, prevInstanceId,]) => {
    if (instanceId === winId && environments[winId]) {
        return environments[winId].$window$;
    }
    else {
        return getOrCreateNodeInstance(winId, instanceId, nodeName, undefined, undefined, prevInstanceId);
    }
};
export const callWorkerRefHandler = ({ $winId$, $instanceId$, $refId$, $thisArg$, $args$, }) => {
    if (webWorkerRefsByRefId[$refId$]) {
        try {
            webWorkerRefsByRefId[$refId$].apply(deserializeFromMain($winId$, $instanceId$, [], $thisArg$), deserializeFromMain($winId$, $instanceId$, [], $args$));
        }
        catch (e) {
            console.error(e);
        }
    }
};
const deserializeRefFromMain = (applyPath, { $winId$, $instanceId$, $nodeName$, $refId$ }) => {
    if (!webWorkerRefsByRefId[$refId$]) {
        webWorkerRefIdsByRef.set((webWorkerRefsByRefId[$refId$] = function (...args) {
            const instance = getOrCreateNodeInstance($winId$, $instanceId$, $nodeName$);
            return callMethod(instance, applyPath, args);
        }), $refId$);
    }
    return webWorkerRefsByRefId[$refId$];
};
class CustomError extends Error {
    constructor(errorObject) {
        super(errorObject.message);
        this.name = errorObject.name;
        this.message = errorObject.message;
        this.stack = errorObject.stack;
    }
}
export class NodeList {
    constructor(nodes) {
        (this._ = nodes).map((node, index) => (this[index] = node));
    }
    entries() {
        return this._.entries();
    }
    forEach(cb, thisArg) {
        this._.map(cb, thisArg);
    }
    item(index) {
        return this[index];
    }
    keys() {
        return this._.keys();
    }
    get length() {
        return len(this._);
    }
    values() {
        return this._.values();
    }
    [Symbol.iterator]() {
        return this._[Symbol.iterator]();
    }
}
export const createNodeListCstr = (win) => {
    win.NodeList = defineConstructorName(NodeList, 'NodeList');
};
const Attr = class {
    constructor(serializedAttr) {
        this.name = serializedAttr[0];
        this.value = serializedAttr[1];
    }
    get nodeName() {
        return this.name;
    }
    get nodeType() {
        return 2;
    }
};
