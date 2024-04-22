import type { MainAccessRequest, MainAccessResponse, WebWorkerContext } from '../types';
declare const syncSendMessageToMainServiceWorker: (webWorkerCtx: WebWorkerContext, accessReq: MainAccessRequest) => MainAccessResponse;
export default syncSendMessageToMainServiceWorker;
