import { callMethod, getter } from './worker-proxy';
import '../types';
import { EMPTY_ARRAY } from '../utils';
import { warnCrossOrigin } from '../log';
export const addStorageApi = (win, storageName, isSameOrigin, env) => {
    let storage = {
        getItem(key) {
            if (isSameOrigin) {
                return callMethod(win, [storageName, 'getItem'], [key], 1 /* CallType.Blocking */);
            }
            else {
                warnCrossOrigin('get', storageName, env);
            }
        },
        setItem(key, value) {
            if (isSameOrigin) {
                callMethod(win, [storageName, 'setItem'], [key, value], 1 /* CallType.Blocking */);
            }
            else {
                warnCrossOrigin('set', storageName, env);
            }
        },
        removeItem(key) {
            if (isSameOrigin) {
                callMethod(win, [storageName, 'removeItem'], [key], 1 /* CallType.Blocking */);
            }
            else {
                warnCrossOrigin('remove', storageName, env);
            }
        },
        key(index) {
            if (isSameOrigin) {
                return callMethod(win, [storageName, 'key'], [index], 1 /* CallType.Blocking */);
            }
            else {
                warnCrossOrigin('key', storageName, env);
            }
        },
        clear() {
            if (isSameOrigin) {
                callMethod(win, [storageName, 'clear'], EMPTY_ARRAY, 1 /* CallType.Blocking */);
            }
            else {
                warnCrossOrigin('clear', storageName, env);
            }
        },
        get length() {
            if (isSameOrigin) {
                return getter(win, [storageName, 'length']);
            }
            else {
                warnCrossOrigin('length', storageName, env);
            }
        },
    };
    win[storageName] = new Proxy(storage, {
        get(target, key) {
            if (Reflect.has(target, key)) {
                return Reflect.get(target, key);
            }
            else {
                return target.getItem(key);
            }
        },
        set(target, key, value) {
            target.setItem(key, value);
            return true;
        },
        has(target, key) {
            if (Reflect.has(target, key)) {
                return true;
            }
            else if (typeof key === 'string') {
                return target.getItem(key) !== null;
            }
            else {
                return false;
            }
        },
        deleteProperty(target, key) {
            target.removeItem(key);
            return true;
        },
    });
};
