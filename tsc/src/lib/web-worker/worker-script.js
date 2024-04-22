import { definePrototypePropertyDescriptor, testIfMustLoadScriptOnMainThread } from '../utils';
import { getInstanceStateValue, setInstanceStateValue } from './worker-state';
import { getter, setter } from './worker-proxy';
import { HTMLSrcElementDescriptorMap } from './worker-src-element';
import { resolveUrl } from './worker-exec';
import '../types';
import { webWorkerCtx } from './worker-constants';
export const patchHTMLScriptElement = (WorkerHTMLScriptElement, env) => {
    const HTMLScriptDescriptorMap = {
        innerHTML: innerHTMLDescriptor,
        innerText: innerHTMLDescriptor,
        src: {
            get() {
                return getInstanceStateValue(this, 4 /* StateProp.url */) || '';
            },
            set(url) {
                const orgUrl = resolveUrl(env, url, null);
                const config = webWorkerCtx.$config$;
                url = resolveUrl(env, url, 'script');
                setInstanceStateValue(this, 4 /* StateProp.url */, url);
                setter(this, ['src'], url);
                if (orgUrl !== url) {
                    setter(this, ['dataset', 'ptsrc'], orgUrl);
                }
                if (this.type) {
                    const shouldExecuteScriptViaMainThread = testIfMustLoadScriptOnMainThread(config, url);
                    if (shouldExecuteScriptViaMainThread) {
                        setter(this, ['type'], 'text/javascript');
                    }
                }
            },
        },
        text: innerHTMLDescriptor,
        textContent: innerHTMLDescriptor,
        type: {
            get() {
                return getter(this, ['type']);
            },
            set(type) {
                if (!isScriptJsType(type)) {
                    setInstanceStateValue(this, 5 /* StateProp.type */, type);
                    setter(this, ['type'], type);
                }
            },
        },
        ...HTMLSrcElementDescriptorMap,
    };
    definePrototypePropertyDescriptor(WorkerHTMLScriptElement, HTMLScriptDescriptorMap);
};
const innerHTMLDescriptor = {
    get() {
        const type = getter(this, ['type']);
        if (isScriptJsType(type)) {
            const scriptContent = getInstanceStateValue(this, 3 /* StateProp.innerHTML */);
            if (scriptContent) {
                return scriptContent;
            }
        }
        return getter(this, ['innerHTML']) || '';
    },
    set(scriptContent) {
        setInstanceStateValue(this, 3 /* StateProp.innerHTML */, scriptContent);
    },
};
export const isScriptJsType = (scriptType) => !scriptType || scriptType === 'text/javascript';
