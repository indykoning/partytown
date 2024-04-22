import { commaSplit, webWorkerCtx } from './worker-constants';
export const initWebWorker = (initWebWorkerData) => {
    const config = (webWorkerCtx.$config$ = JSON.parse(initWebWorkerData.$config$));
    const locOrigin = initWebWorkerData.$origin$;
    webWorkerCtx.$importScripts$ = importScripts.bind(self);
    webWorkerCtx.$interfaces$ = initWebWorkerData.$interfaces$;
    webWorkerCtx.$libPath$ = initWebWorkerData.$libPath$;
    webWorkerCtx.$origin$ = locOrigin;
    webWorkerCtx.$postMessage$ = postMessage.bind(self);
    webWorkerCtx.$sharedDataBuffer$ = initWebWorkerData.$sharedDataBuffer$;
    webWorkerCtx.$tabId$ = initWebWorkerData.$tabId$;
    self.importScripts = undefined;
    delete self.postMessage;
    delete self.WorkerGlobalScope;
    commaSplit('resolveUrl,resolveSendBeaconRequestParameters,get,set,apply').map((configName) => {
        if (config[configName]) {
            config[configName] = new Function('return ' + config[configName])();
        }
    });
};
