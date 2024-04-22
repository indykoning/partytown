import { callMethod } from './worker-proxy';
import { getOrCreateNodeInstance } from './worker-constructors';
export const createCustomElementRegistry = (win, nodeCstrs) => {
    const customElements = 'customElements';
    const registry = new Map();
    win[customElements] = {
        define(tagName, Cstr, opts) {
            registry.set(tagName, Cstr);
            nodeCstrs[tagName.toUpperCase()] = Cstr;
            const ceData = [Cstr.name, Cstr.observedAttributes];
            callMethod(win, [customElements, 'define'], [tagName, ceData, opts]);
        },
        get: (tagName) => registry.get(tagName) || callMethod(win, [customElements, 'get'], [tagName]),
        whenDefined: (tagName) => registry.has(tagName)
            ? Promise.resolve()
            : callMethod(win, [customElements, 'whenDefined'], [tagName]),
        upgrade: (elm) => callMethod(win, [customElements, 'upgrade'], [elm]),
    };
};
export const callCustomElementCallback = (_type, winId, instanceId, callbackName, args) => {
    const elm = getOrCreateNodeInstance(winId, instanceId);
    if (elm && typeof elm[callbackName] === 'function') {
        elm[callbackName].apply(elm, args);
    }
};
