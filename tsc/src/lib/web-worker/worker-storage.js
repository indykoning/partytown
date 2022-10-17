import { callMethod } from './worker-proxy';
import '../types';
import { EMPTY_ARRAY } from '../utils';
import { warnCrossOrgin } from '../log';
export const addStorageApi = (win, storageName, storages, isSameOrigin, env) => {
    let getItems = (items) => {
        items = storages.get(win.origin);
        if (!items) {
            storages.set(win.origin, (items = []));
        }
        return items;
    };
    let getIndexByKey = (key) => getItems().findIndex((i) => i[STORAGE_KEY] === key);
    let index;
    let item;
    let storage = {
        getItem(key) {
            index = getIndexByKey(key);
            return index > -1 ? getItems()[index][STORAGE_VALUE] : null;
        },
        setItem(key, value) {
            index = getIndexByKey(key);
            if (index > -1) {
                getItems()[index][STORAGE_VALUE] = value;
            }
            else {
                getItems().push([key, value]);
            }
            if (isSameOrigin) {
                callMethod(win, [storageName, 'setItem'], [key, value], 2 /* NonBlocking */);
            }
            else {
                warnCrossOrgin('set', storageName, env);
            }
        },
        removeItem(key) {
            index = getIndexByKey(key);
            if (index > -1) {
                getItems().splice(index, 1);
            }
            if (isSameOrigin) {
                callMethod(win, [storageName, 'removeItem'], [key], 2 /* NonBlocking */);
            }
            else {
                warnCrossOrgin('remove', storageName, env);
            }
        },
        key(index) {
            item = getItems()[index];
            return item ? item[STORAGE_KEY] : null;
        },
        clear() {
            getItems().length = 0;
            if (isSameOrigin) {
                callMethod(win, [storageName, 'clear'], EMPTY_ARRAY, 2 /* NonBlocking */);
            }
            else {
                warnCrossOrgin('clear', storageName, env);
            }
        },
        get length() {
            return getItems().length;
        },
    };
    win[storageName] = storage;
};
const STORAGE_KEY = 0;
const STORAGE_VALUE = 1;
