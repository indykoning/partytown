import { definePrototypePropertyDescriptor } from '../utils';
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
                return getInstanceStateValue(this, 4 /* url */) || '';
            },
            set(url) {
                const orgUrl = resolveUrl(env, url, null);
                const config = webWorkerCtx.$config$;
                url = resolveUrl(env, url, 'script');
                setInstanceStateValue(this, 4 /* url */, url);
                setter(this, ['src'], url);
                if (orgUrl !== url) {
                    setter(this, ['dataset', 'ptsrc'], orgUrl);
                }
                if (this.type && config.loadScriptsOnMainThread) {
                    const shouldExecuteScriptViaMainThread = config.loadScriptsOnMainThread.some(scriptUrl => scriptUrl === url);
                    if (shouldExecuteScriptViaMainThread) {
                        setter(this, ['type'], 'text/javascript');
                    }
                }
            },
        },
        textContent: innerHTMLDescriptor,
        type: {
            get() {
                return getter(this, ['type']);
            },
            set(type) {
                if (!isScriptJsType(type)) {
                    setInstanceStateValue(this, 5 /* type */, type);
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
        return getInstanceStateValue(this, 3 /* innerHTML */) || '';
    },
    set(scriptContent) {
        setInstanceStateValue(this, 3 /* innerHTML */, scriptContent);
    },
};
export const isScriptJsType = (scriptType) => !scriptType || scriptType === 'text/javascript';
