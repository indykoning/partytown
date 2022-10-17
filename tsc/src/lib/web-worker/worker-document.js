import { callMethod, getter, setter } from './worker-proxy';
import '../types';
import { cachedProps, cachedTreeProps, definePrototypeNodeType, getOrCreateNodeInstance, } from './worker-constructors';
import { createEnvironment } from './worker-environment';
import './worker-window';
import { debug, definePrototypePropertyDescriptor, randomId, SCRIPT_TYPE } from '../utils';
import { ABOUT_BLANK, elementStructurePropNames, IS_TAG_REG, WinIdKey } from './worker-constants';
import { getInstanceStateValue } from './worker-state';
import { getPartytownScript } from './worker-exec';
import { isScriptJsType } from './worker-script';
import { warnCrossOrgin } from '../log';
export const patchDocument = (WorkerDocument, env, isDocumentImplementation) => {
    const DocumentDescriptorMap = {
        body: {
            get() {
                return env.$body$;
            },
        },
        cookie: {
            get() {
                if (env.$isSameOrigin$) {
                    return getter(this, ['cookie']);
                }
                else {
                    warnCrossOrgin('get', 'cookie', env);
                    return '';
                }
            },
            set(value) {
                if (env.$isSameOrigin$) {
                    setter(this, ['cookie'], value);
                }
                else if (debug) {
                    warnCrossOrgin('set', 'cookie', env);
                }
            },
        },
        createElement: {
            value(tagName) {
                tagName = tagName.toUpperCase();
                if (!IS_TAG_REG.test(tagName)) {
                    throw tagName + ' not valid';
                }
                const isIframe = tagName === "IFRAME" /* IFrame */;
                const winId = this[WinIdKey];
                const instanceId = (isIframe ? 'f_' : '') + randomId();
                callMethod(this, ['createElement'], [tagName], 2 /* NonBlocking */, instanceId);
                const elm = getOrCreateNodeInstance(winId, instanceId, tagName);
                if (isIframe) {
                    // an iframe element's instanceId is the same as its contentWindow's winId
                    // and the contentWindow's parentWinId is the iframe element's winId
                    const env = createEnvironment({
                        $winId$: instanceId,
                        $parentWinId$: winId,
                        $url$: ABOUT_BLANK,
                    }, true);
                    // iframe's get the native fetch
                    // common for analytics to use "const fetch = iframe.contentWindow.fetch"
                    // so they don't go through a patched fetch()
                    env.$window$.fetch = fetch;
                    setter(elm, ['srcdoc'], getPartytownScript());
                }
                else if (tagName === "SCRIPT" /* Script */) {
                    const scriptType = getInstanceStateValue(elm, 5 /* type */);
                    if (isScriptJsType(scriptType)) {
                        setter(elm, ['type'], SCRIPT_TYPE);
                    }
                }
                return elm;
            },
        },
        createElementNS: {
            value(namespace, tagName) {
                const instanceId = randomId();
                const nsElm = getOrCreateNodeInstance(this[WinIdKey], instanceId, tagName, namespace);
                callMethod(this, ['createElementNS'], [namespace, tagName], 2 /* NonBlocking */, instanceId);
                return nsElm;
            },
        },
        createTextNode: {
            value(text) {
                const winId = this[WinIdKey];
                const instanceId = randomId();
                const textNode = getOrCreateNodeInstance(winId, instanceId, "#text" /* Text */);
                callMethod(this, ['createTextNode'], [text], 2 /* NonBlocking */, instanceId);
                return textNode;
            },
        },
        createEvent: {
            value: (type) => new Event(type),
        },
        currentScript: {
            get() {
                if (env.$currentScriptId$) {
                    return getOrCreateNodeInstance(this[WinIdKey], env.$currentScriptId$, "SCRIPT" /* Script */);
                }
                return null;
            },
        },
        defaultView: {
            get() {
                return !isDocumentImplementation ? env.$window$ : null;
            },
        },
        documentElement: {
            get() {
                return env.$documentElement$;
            },
        },
        getElementsByTagName: {
            value(tagName) {
                tagName = tagName.toUpperCase();
                if (tagName === "BODY" /* Body */) {
                    return [env.$body$];
                }
                else if (tagName === "HEAD" /* Head */) {
                    return [env.$head$];
                }
                else {
                    return callMethod(this, ['getElementsByTagName'], [tagName]);
                }
            },
        },
        head: {
            get() {
                return env.$head$;
            },
        },
        images: {
            get() {
                return getter(this, ['images']);
            },
        },
        implementation: {
            get() {
                return {
                    hasFeature: () => true,
                    createHTMLDocument: (title) => {
                        const $winId$ = randomId();
                        callMethod(this, ['implementation', 'createHTMLDocument'], [title], 1 /* Blocking */, {
                            $winId$,
                        });
                        const docEnv = createEnvironment({
                            $winId$,
                            $parentWinId$: $winId$,
                            $url$: env.$location$ + '',
                            $visibilityState$: 'hidden',
                        }, true, true);
                        return docEnv.$document$;
                    },
                };
            },
        },
        location: {
            get() {
                return env.$location$;
            },
            set(url) {
                env.$location$.href = url + '';
            },
        },
        nodeType: {
            value: 9,
        },
        parentNode: {
            value: null,
        },
        parentElement: {
            value: null,
        },
        readyState: {
            value: 'complete',
        },
        visibilityState: {
            get: () => env.$visibilityState$ || 'visible',
        },
    };
    definePrototypePropertyDescriptor(WorkerDocument, DocumentDescriptorMap);
    cachedProps(WorkerDocument, 'compatMode,referrer,forms');
};
export const patchDocumentElementChild = (WokerDocumentElementChild, env) => {
    const DocumentElementChildDescriptorMap = {
        parentElement: {
            get() {
                return this.parentNode;
            },
        },
        parentNode: {
            get() {
                return env.$documentElement$;
            },
        },
    };
    definePrototypePropertyDescriptor(WokerDocumentElementChild, DocumentElementChildDescriptorMap);
};
export const patchHTMLHtmlElement = (WorkerHTMLHtmlElement, env) => {
    const DocumentElementDescriptorMap = {
        parentElement: {
            value: null,
        },
        parentNode: {
            get() {
                return env.$document$;
            },
        },
    };
    definePrototypePropertyDescriptor(WorkerHTMLHtmlElement, DocumentElementDescriptorMap);
};
export const patchDocumentFragment = (WorkerDocumentFragment) => {
    definePrototypeNodeType(WorkerDocumentFragment, 11);
    cachedTreeProps(WorkerDocumentFragment, elementStructurePropNames);
};
