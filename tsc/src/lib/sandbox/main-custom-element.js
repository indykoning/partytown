import '../types';
import { defineConstructorName } from '../utils';
import { getAndSetInstanceId } from './main-instances';
import { winCtxs } from './main-constants';
export const defineCustomElement = (winId, worker, ceData) => {
    const Cstr = defineConstructorName(class extends winCtxs[winId].$window$.HTMLElement {
    }, ceData[0]);
    const ceCallbackMethods = 'connectedCallback,disconnectedCallback,attributeChangedCallback,adoptedCallback'.split(',');
    ceCallbackMethods.map((callbackMethodName) => (Cstr.prototype[callbackMethodName] = function (...args) {
        worker.postMessage([
            15 /* WorkerMessageType.CustomElementCallback */,
            winId,
            getAndSetInstanceId(this),
            callbackMethodName,
            args,
        ]);
    }));
    Cstr.observedAttributes = ceData[1];
    return Cstr;
};
