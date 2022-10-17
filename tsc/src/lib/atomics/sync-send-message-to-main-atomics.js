import '../types';
const syncSendMessageToMainAtomics = (webWorkerCtx, accessReq) => {
    const sharedDataBuffer = webWorkerCtx.$sharedDataBuffer$;
    const sharedData = new Int32Array(sharedDataBuffer);
    // Reset length before call
    Atomics.store(sharedData, 0, 0);
    // Asynchronously call main
    webWorkerCtx.$postMessage$([11 /* ForwardWorkerAccessRequest */, accessReq]);
    // Synchronously wait for response
    Atomics.wait(sharedData, 0, 0);
    let dataLength = Atomics.load(sharedData, 0);
    let accessRespStr = '';
    let i = 0;
    for (; i < dataLength; i++) {
        accessRespStr += String.fromCharCode(sharedData[i + 1]);
    }
    return JSON.parse(accessRespStr);
};
export default syncSendMessageToMainAtomics;
