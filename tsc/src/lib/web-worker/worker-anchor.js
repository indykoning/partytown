import { commaSplit } from './worker-constants';
import { definePrototypePropertyDescriptor, isValidUrl } from '../utils';
import { getInstanceStateValue, setInstanceStateValue } from './worker-state';
import { getter, setter } from './worker-proxy';
import { resolveToUrl } from './worker-exec';
import '../types';
export const patchHTMLAnchorElement = (WorkerHTMLAnchorElement, env) => {
    const HTMLAnchorDescriptorMap = {};
    commaSplit('hash,host,hostname,href,origin,pathname,port,protocol,search').map((anchorProp) => {
        HTMLAnchorDescriptorMap[anchorProp] = {
            get() {
                let value = getInstanceStateValue(this, 4 /* url */);
                let href;
                if (typeof value !== 'string') {
                    href = getter(this, ['href']);
                    setInstanceStateValue(this, 4 /* url */, href);
                    value = new URL(href)[anchorProp];
                }
                return resolveToUrl(env, value, null)[anchorProp];
            },
            set(value) {
                let url;
                if (anchorProp === 'href') {
                    if (isValidUrl(value)) {
                        url = new URL(value);
                    }
                    else {
                        const baseHref = env.$location$.href;
                        url = resolveToUrl(env, baseHref, null);
                        url.href = new URL(value + '', url.href);
                    }
                }
                else {
                    url = resolveToUrl(env, this.href, null);
                    url[anchorProp] = value;
                }
                setInstanceStateValue(this, 4 /* url */, url.href);
                setter(this, ['href'], url.href);
            },
        };
    });
    definePrototypePropertyDescriptor(WorkerHTMLAnchorElement, HTMLAnchorDescriptorMap);
};
