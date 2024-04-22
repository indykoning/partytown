import { serializeConfig } from '../lib/utils';
export const createSnippet = (config, snippetCode) => {
    const { forward = [], ...filteredConfig } = config || {};
    const configStr = serializeConfig(filteredConfig);
    return [
        `!(function(w,p,f,c){`,
        `if(!window.crossOriginIsolated && !navigator.serviceWorker) return;`,
        Object.keys(filteredConfig).length > 0
            ? `c=w[p]=Object.assign(w[p]||{},${configStr});`
            : `c=w[p]=w[p]||{};`,
        `c[f]=(c[f]||[])`,
        forward.length > 0 ? `.concat(${JSON.stringify(forward)})` : ``,
        `})(window,'partytown','forward');`,
        snippetCode,
    ].join('');
};
