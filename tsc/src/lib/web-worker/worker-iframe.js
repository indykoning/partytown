import { createEnvironment } from './worker-environment';
import { definePrototypePropertyDescriptor, SCRIPT_TYPE } from '../utils';
import { ABOUT_BLANK, environments, InstanceIdKey, webWorkerCtx, WinIdKey, } from './worker-constants';
import { getPartytownScript, resolveUrl } from './worker-exec';
import { getter, sendToMain, setter } from './worker-proxy';
import { HTMLSrcElementDescriptorMap } from './worker-src-element';
import { setInstanceStateValue, getInstanceStateValue } from './worker-state';
import '../types';
export const patchHTMLIFrameElement = (WorkerHTMLIFrameElement, env) => {
    const HTMLIFrameDescriptorMap = {
        contentDocument: {
            get() {
                return getIframeEnv(this).$document$;
            },
        },
        contentWindow: {
            get() {
                return getIframeEnv(this).$window$;
            },
        },
        src: {
            get() {
                let src = getInstanceStateValue(this, 0 /* src */);
                if (src && src.startsWith('javascript:')) {
                    return src;
                }
                src = getIframeEnv(this).$location$.href;
                return src.startsWith('about:') ? '' : src;
            },
            set(src) {
                if (!src) {
                    return;
                }
                if (src.startsWith('javascript:')) {
                    setInstanceStateValue(this, 0 /* src */, src);
                    return;
                }
                if (!src.startsWith('about:')) {
                    let xhr = new XMLHttpRequest();
                    let xhrStatus;
                    let env = getIframeEnv(this);
                    env.$location$.href = src = resolveUrl(env, src, 'iframe');
                    env.$isLoading$ = 1;
                    setInstanceStateValue(this, 1 /* loadErrorStatus */, undefined);
                    xhr.open('GET', src, false);
                    xhr.send();
                    xhrStatus = xhr.status;
                    if (xhrStatus > 199 && xhrStatus < 300) {
                        setter(this, ['srcdoc'], `<base href="${src}">` +
                            xhr.responseText
                                .replace(/<script>/g, `<script type="${SCRIPT_TYPE}">`)
                                .replace(/<script /g, `<script type="${SCRIPT_TYPE}" `)
                                .replace(/text\/javascript/g, SCRIPT_TYPE) +
                            getPartytownScript());
                        sendToMain(true);
                        webWorkerCtx.$postMessage$([7 /* InitializeNextScript */, env.$winId$]);
                    }
                    else {
                        setInstanceStateValue(this, 1 /* loadErrorStatus */, xhrStatus);
                        env.$isLoading$ = 0;
                    }
                }
            },
        },
        ...HTMLSrcElementDescriptorMap,
    };
    definePrototypePropertyDescriptor(WorkerHTMLIFrameElement, HTMLIFrameDescriptorMap);
};
const getIframeEnv = (iframe) => {
    // the winId of an iframe's contentWindow is the same
    // as the instanceId of the containing iframe element
    const $winId$ = iframe[InstanceIdKey];
    if (!environments[$winId$]) {
        createEnvironment({
            $winId$,
            // iframe contentWindow parent winId is the iframe element's winId
            $parentWinId$: iframe[WinIdKey],
            $url$: getter(iframe, ['src']) || ABOUT_BLANK,
        }, true);
    }
    return environments[$winId$];
};
