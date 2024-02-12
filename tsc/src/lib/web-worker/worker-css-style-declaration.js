import '../types';
import { cachedDimensions, InstanceDataKey } from './worker-constants';
import { callMethod, getter, setter } from './worker-proxy';
import { defineConstructorName } from '../utils';
import { logDimensionCacheClearStyle } from '../log';
export const createCSSStyleDeclarationCstr = (win, WorkerBase, cstrName) => {
    win[cstrName] = defineConstructorName(class extends WorkerBase {
        constructor(winId, instanceId, applyPath, styles) {
            super(winId, instanceId, applyPath, styles || {});
            return new Proxy(this, {
                get(target, propName) {
                    if (target[propName]) {
                        return target[propName];
                    }
                    if (!target[propName] &&
                        typeof propName === 'string' &&
                        !target[InstanceDataKey][propName]) {
                        target[InstanceDataKey][propName] = getter(target, [propName]);
                    }
                    return target[InstanceDataKey][propName];
                },
                set(target, propName, propValue) {
                    target[InstanceDataKey][propName] = propValue;
                    setter(target, [propName], propValue);
                    logDimensionCacheClearStyle(target, propName);
                    cachedDimensions.clear();
                    return true;
                },
            });
        }
        setProperty(...args) {
            this[InstanceDataKey][args[0]] = args[1];
            callMethod(this, ['setProperty'], args, 2 /* CallType.NonBlocking */);
            logDimensionCacheClearStyle(this, args[0]);
            cachedDimensions.clear();
        }
        getPropertyValue(propName) {
            return this[propName];
        }
        removeProperty(propName) {
            let value = this[InstanceDataKey][propName];
            callMethod(this, ['removeProperty'], [propName], 2 /* CallType.NonBlocking */);
            logDimensionCacheClearStyle(this, propName);
            cachedDimensions.clear();
            this[InstanceDataKey][propName] = undefined;
            return value;
        }
    }, cstrName);
};
