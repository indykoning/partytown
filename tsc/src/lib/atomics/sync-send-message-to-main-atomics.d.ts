import { MainAccessRequest, MainAccessResponse, WebWorkerContext } from '../types';
declare const syncSendMessageToMainAtomics: (webWorkerCtx: WebWorkerContext, accessReq: MainAccessRequest) => MainAccessResponse;
export default syncSendMessageToMainAtomics;
