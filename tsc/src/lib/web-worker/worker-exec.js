import { VERSION } from '../build-modules/version';
import { logWorker } from '../log';
import '../types';
import { debug } from '../utils';
import { environments, partytownLibUrl, webWorkerCtx } from './worker-constants';
import { getOrCreateNodeInstance } from './worker-constructors';
import { getInstanceStateValue, setInstanceStateValue } from './worker-state';
export const initNextScriptsInWebWorker = async (initScript) => {
    let winId = initScript.$winId$;
    let instanceId = initScript.$instanceId$;
    let instance = getOrCreateNodeInstance(winId, instanceId, "SCRIPT" /* Script */);
    let scriptContent = initScript.$content$;
    let scriptSrc = initScript.$url$;
    let scriptOrgSrc = initScript.$orgUrl$;
    let errorMsg = '';
    let env = environments[winId];
    let rsp;
    let javascriptContentTypes = [
        'text/jscript',
        'text/javascript',
        'text/x-javascript',
        'application/javascript',
        'application/x-javascript',
        'text/ecmascript',
        'text/x-ecmascript',
        'application/ecmascript',
    ];
    if (scriptSrc) {
        try {
            scriptSrc = resolveToUrl(env, scriptSrc, 'script') + '';
            setInstanceStateValue(instance, 4 /* url */, scriptSrc);
            if (debug && webWorkerCtx.$config$.logScriptExecution) {
                logWorker(`Execute script src: ${scriptOrgSrc}`, winId);
            }
            rsp = await fetch(scriptSrc);
            if (rsp.ok) {
                let responseContentType = rsp.headers.get('content-type');
                let shouldExecute = javascriptContentTypes.some((ct) => { var _a, _b, _c; return (_c = (_a = responseContentType === null || responseContentType === void 0 ? void 0 : responseContentType.toLowerCase) === null || _a === void 0 ? void 0 : (_b = _a.call(responseContentType)).includes) === null || _c === void 0 ? void 0 : _c.call(_b, ct); });
                if (shouldExecute) {
                    scriptContent = await rsp.text();
                    env.$currentScriptId$ = instanceId;
                    run(env, scriptContent, scriptOrgSrc || scriptSrc);
                }
                runStateLoadHandlers(instance, "load" /* loadHandlers */);
            }
            else {
                errorMsg = rsp.statusText;
                runStateLoadHandlers(instance, "error" /* errorHandlers */);
            }
        }
        catch (urlError) {
            console.error(urlError);
            errorMsg = String(urlError.stack || urlError);
            runStateLoadHandlers(instance, "error" /* errorHandlers */);
        }
    }
    else if (scriptContent) {
        errorMsg = runScriptContent(env, instanceId, scriptContent, winId, errorMsg);
    }
    env.$currentScriptId$ = '';
    webWorkerCtx.$postMessage$([
        6 /* InitializedEnvironmentScript */,
        winId,
        instanceId,
        errorMsg,
    ]);
};
export const runScriptContent = (env, instanceId, scriptContent, winId, errorMsg) => {
    try {
        if (debug && webWorkerCtx.$config$.logScriptExecution) {
            logWorker(`Execute script: ${scriptContent
                .substring(0, 100)
                .split('\n')
                .map((l) => l.trim())
                .join(' ')
                .trim()
                .substring(0, 60)}...`, winId);
        }
        env.$currentScriptId$ = instanceId;
        run(env, scriptContent);
    }
    catch (contentError) {
        console.error(scriptContent, contentError);
        errorMsg = String(contentError.stack || contentError);
    }
    env.$currentScriptId$ = '';
    return errorMsg;
};
export const run = (env, scriptContent, scriptUrl) => {
    env.$runWindowLoadEvent$ = 1;
    scriptContent =
        `with(this){${scriptContent
            .replace(/\bthis\b/g, (match, offset, originalStr) => offset > 0 && originalStr[offset - 1] !== '$' ? '(thi$(this)?window:this)' : match)
            .replace(/\/\/# so/g, '//Xso')}\n;function thi$(t){return t===this}};${(webWorkerCtx.$config$.globalFns || [])
            .filter((globalFnName) => /[a-zA-Z_$][0-9a-zA-Z_$]*/.test(globalFnName))
            .map((g) => `(typeof ${g}=='function'&&(this.${g}=${g}))`)
            .join(';')};` + (scriptUrl ? '\n//# sourceURL=' + scriptUrl : '');
    if (!env.$isSameOrigin$) {
        scriptContent = scriptContent.replace(/.postMessage\(/g, `.postMessage('${env.$winId$}',`);
    }
    new Function(scriptContent).call(env.$window$);
    env.$runWindowLoadEvent$ = 0;
};
const runStateLoadHandlers = (instance, type, handlers) => {
    handlers = getInstanceStateValue(instance, type);
    if (handlers) {
        setTimeout(() => handlers.map((cb) => cb({ type })));
    }
};
export const insertIframe = (winId, iframe) => {
    // an iframe element's instanceId is also
    // the winId of its contentWindow
    let i = 0;
    let type;
    let handlers;
    let callback = () => {
        if (environments[winId] &&
            environments[winId].$isInitialized$ &&
            !environments[winId].$isLoading$) {
            type = getInstanceStateValue(iframe, 1 /* loadErrorStatus */)
                ? "error" /* errorHandlers */
                : "load" /* loadHandlers */;
            handlers = getInstanceStateValue(iframe, type);
            if (handlers) {
                handlers.map((handler) => handler({ type }));
            }
        }
        else if (i++ > 2000) {
            handlers = getInstanceStateValue(iframe, "error" /* errorHandlers */);
            if (handlers) {
                handlers.map((handler) => handler({ type: "error" /* errorHandlers */ }));
            }
        }
        else {
            setTimeout(callback, 9);
        }
    };
    callback();
};
export const resolveToUrl = (env, url, type, baseLocation, resolvedUrl, configResolvedUrl) => {
    baseLocation = env.$location$;
    while (!baseLocation.host) {
        env = environments[env.$parentWinId$];
        baseLocation = env.$location$;
        if (env.$winId$ === env.$parentWinId$) {
            break;
        }
    }
    resolvedUrl = new URL(url || '', baseLocation);
    if (type && webWorkerCtx.$config$.resolveUrl) {
        configResolvedUrl = webWorkerCtx.$config$.resolveUrl(resolvedUrl, baseLocation, type);
        if (configResolvedUrl) {
            return configResolvedUrl;
        }
    }
    return resolvedUrl;
};
export const resolveUrl = (env, url, type) => resolveToUrl(env, url, type) + '';
export const getPartytownScript = () => `<script src="${partytownLibUrl('partytown.js?v=' + VERSION)}"></script>`;
