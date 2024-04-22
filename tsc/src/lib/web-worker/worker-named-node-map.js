import '../types';
import { defineConstructorName } from '../utils';
import { callMethod, getter, setter } from './worker-proxy';
export const createNamedNodeMapCstr = (win, WorkerBase) => {
    const NamedNodeMap = class NamedNodeMap extends WorkerBase {
        constructor(winId, instanceId, applyPath) {
            super(winId, instanceId, applyPath);
            return new Proxy(this, {
                get(target, propName) {
                    const handler = NAMED_NODE_MAP_HANDLERS[propName];
                    if (handler) {
                        return handler.bind(target, [propName]);
                    }
                    else {
                        return getter(target, [propName]);
                    }
                },
                set(target, propName, propValue) {
                    const handler = NAMED_NODE_MAP_HANDLERS[propName];
                    if (handler) {
                        throw new Error("Can't set read-only property: " + String(propName));
                    }
                    else {
                        setter(target, [propName], propValue);
                    }
                    return true;
                },
            });
        }
    };
    win.NamedNodeMap = defineConstructorName(NamedNodeMap, 'NamedNodeMap');
};
function method(applyPath, ...args) {
    return callMethod(this, applyPath, args, 1 /* CallType.Blocking */);
}
const NAMED_NODE_MAP_HANDLERS = {
    getNamedItem: method,
    getNamedItemNS: method,
    item: method,
    removeNamedItem: method,
    removeNamedItemNS: method,
    setNamedItem: method,
    setNamedItemNS: method,
};
