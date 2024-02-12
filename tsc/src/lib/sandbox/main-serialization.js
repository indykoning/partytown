import { getConstructorName, getNodeName, isValidMemberName, startsWith } from '../utils';
import { getInstance, getAndSetInstanceId } from './main-instances';
import { mainRefs } from './main-constants';
import '../types';
export const serializeForWorker = ($winId$, value, added, type, cstrName, prevInstanceId) => {
    if (value !== undefined && (type = typeof value)) {
        if (type === 'string' || type === 'number' || type === 'boolean' || value == null) {
            return [0 /* SerializedType.Primitive */, value];
        }
        else if (type === 'function') {
            return [6 /* SerializedType.Function */];
        }
        else if ((added = added || new Set()) && Array.isArray(value)) {
            if (added.has(value)) {
                return [1 /* SerializedType.Array */, []];
            }
            else {
                return (added.add(value) && [
                    1 /* SerializedType.Array */,
                    value.map((v) => serializeForWorker($winId$, v, added)),
                ]);
            }
        }
        else if (type === 'object') {
            if (serializedValueIsError(value)) {
                return [
                    14 /* SerializedType.Error */,
                    {
                        name: value.name,
                        message: value.message,
                        stack: value.stack,
                    },
                ];
            }
            else if ((cstrName = getConstructorName(value)) === '') {
                // error reading this object, probably "DOMException: Blocked from accessing a cross-origin frame."
                return [2 /* SerializedType.Object */, {}];
            }
            else if (cstrName === 'Window') {
                return [3 /* SerializedType.Instance */, [$winId$, $winId$]];
            }
            else if (cstrName === 'HTMLCollection' || cstrName === 'NodeList') {
                return [
                    7 /* SerializedType.NodeList */,
                    Array.from(value).map((v) => serializeForWorker($winId$, v, added)[1]),
                ];
            }
            else if (cstrName.endsWith('Event')) {
                return [5 /* SerializedType.Event */, serializeObjectForWorker($winId$, value, added)];
            }
            else if (cstrName === 'CSSRuleList') {
                return [12 /* SerializedType.CSSRuleList */, Array.from(value).map(serializeCssRuleForWorker)];
            }
            else if (startsWith(cstrName, 'CSS') && cstrName.endsWith('Rule')) {
                return [11 /* SerializedType.CSSRule */, serializeCssRuleForWorker(value)];
            }
            else if (cstrName === 'CSSStyleDeclaration') {
                return [
                    13 /* SerializedType.CSSStyleDeclaration */,
                    serializeObjectForWorker($winId$, value, added),
                ];
            }
            else if (cstrName === 'Attr') {
                return [10 /* SerializedType.Attr */, [value.name, value.value]];
            }
            else if (value.nodeType) {
                return [
                    3 /* SerializedType.Instance */,
                    [$winId$, getAndSetInstanceId(value), getNodeName(value), prevInstanceId],
                ];
            }
            else {
                return [2 /* SerializedType.Object */, serializeObjectForWorker($winId$, value, added, true, true)];
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
const serializeObjectForWorker = (winId, obj, added, includeFunctions, includeEmptyStrings, serializedObj, propName, propValue) => {
    serializedObj = {};
    if (!added.has(obj)) {
        added.add(obj);
        for (propName in obj) {
            if (isValidMemberName(propName)) {
                if (propName === 'path' && getConstructorName(obj).endsWith('Event')) {
                    propValue = obj.composedPath();
                }
                else {
                    propValue = obj[propName];
                }
                if (includeFunctions || typeof propValue !== 'function') {
                    if (includeEmptyStrings || propValue !== '') {
                        serializedObj[propName] = serializeForWorker(winId, propValue, added);
                    }
                }
            }
        }
    }
    return serializedObj;
};
const serializeCssRuleForWorker = (cssRule) => {
    let obj = {};
    let key;
    for (key in cssRule) {
        if (validCssRuleProps.includes(key)) {
            obj[key] = String(cssRule[key]);
        }
    }
    return obj;
};
const serializedValueIsError = (value) => {
    return value instanceof window.top.Error;
};
export const deserializeFromWorker = (worker, serializedTransfer, serializedType, serializedValue) => {
    if (serializedTransfer) {
        serializedType = serializedTransfer[0];
        serializedValue = serializedTransfer[1];
        if (serializedType === 0 /* SerializedType.Primitive */) {
            return serializedValue;
        }
        else if (serializedType === 4 /* SerializedType.Ref */) {
            return deserializeRefFromWorker(worker, serializedValue);
        }
        else if (serializedType === 1 /* SerializedType.Array */) {
            return serializedValue.map((v) => deserializeFromWorker(worker, v));
        }
        else if (serializedType === 3 /* SerializedType.Instance */) {
            return getInstance(serializedValue[0], serializedValue[1]);
        }
        else if (serializedType === 5 /* SerializedType.Event */) {
            return constructEvent(deserializeObjectFromWorker(worker, serializedValue));
        }
        else if (serializedType === 2 /* SerializedType.Object */) {
            return deserializeObjectFromWorker(worker, serializedValue);
        }
        else if (serializedType === 8 /* SerializedType.ArrayBuffer */) {
            return serializedValue;
        }
        else if (serializedType === 9 /* SerializedType.ArrayBufferView */) {
            return new window[serializedTransfer[2]](serializedValue);
        }
        else {
            return;
        }
    }
    else {
        // improve minification
        return;
    }
};
const deserializeRefFromWorker = (worker, { $winId$, $instanceId$, $refId$ }, ref) => {
    ref = mainRefs.get($refId$);
    if (!ref) {
        ref = function (...args) {
            worker.postMessage([
                9 /* WorkerMessageType.RefHandlerCallback */,
                {
                    $winId$,
                    $instanceId$,
                    $refId$,
                    $thisArg$: serializeForWorker($winId$, this),
                    $args$: serializeForWorker($winId$, args),
                },
            ]);
        };
        mainRefs.set($refId$, ref);
    }
    return ref;
};
const constructEvent = (eventProps) => new ('detail' in eventProps ? CustomEvent : Event)(eventProps.type, eventProps);
const deserializeObjectFromWorker = (worker, serializedValue, obj, key) => {
    obj = {};
    for (key in serializedValue) {
        obj[key] = deserializeFromWorker(worker, serializedValue[key]);
    }
    return obj;
};
const validCssRuleProps = 'cssText,selectorText,href,media,namespaceURI,prefix,name,conditionText'.split(',');
