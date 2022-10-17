import { callMethod } from './worker-proxy';
import { commaSplit } from './worker-constants';
import '../types';
import { getInstanceStateValue, setInstanceStateValue } from './worker-state';
import { noop } from '../utils';
export const HTMLSrcElementDescriptorMap = {
    addEventListener: {
        value(...args) {
            const eventName = args[0];
            const callbacks = getInstanceStateValue(this, eventName) || [];
            callbacks.push(args[1]);
            setInstanceStateValue(this, eventName, callbacks);
        },
    },
    async: {
        get: noop,
        set: noop,
    },
    defer: {
        get: noop,
        set: noop,
    },
    onload: {
        get() {
            let callbacks = getInstanceStateValue(this, "load" /* loadHandlers */);
            return (callbacks && callbacks[0]) || null;
        },
        set(cb) {
            setInstanceStateValue(this, "load" /* loadHandlers */, cb ? [cb] : null);
        },
    },
    onerror: {
        get() {
            let callbacks = getInstanceStateValue(this, "error" /* errorHandlers */);
            return (callbacks && callbacks[0]) || null;
        },
        set(cb) {
            setInstanceStateValue(this, "error" /* errorHandlers */, cb ? [cb] : null);
        },
    },
    getAttribute: {
        value(attrName) {
            if (attrName === 'src') {
                return this.src;
            }
            return callMethod(this, ['getAttribute'], [attrName]);
        },
    },
    setAttribute: {
        value(attrName, attrValue) {
            if (scriptAttrPropNames.includes(attrName)) {
                this[attrName] = attrValue;
            }
            else {
                callMethod(this, ['setAttribute'], [attrName, attrValue]);
            }
        },
    },
};
const scriptAttrPropNames = commaSplit('src,type');
