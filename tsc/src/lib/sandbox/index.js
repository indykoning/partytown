import { debug } from '../utils';
import { getAndSetInstanceId } from './main-instances';
import { libPath, mainWindow } from './main-globals';
import { logMain } from '../log';
import { mainAccessHandler } from './main-access-handler';
import '../types';
import { registerWindow } from './main-register-window';
import syncCreateMessenger from '../build-modules/sync-create-messenger';
import WebWorkerBlob from '../build-modules/web-worker-blob';
import WebWorkerUrl from '../build-modules/web-worker-url';
import { VERSION } from '../build-modules/version';
let worker;
const receiveMessage = (accessReq, responseCallback) => mainAccessHandler(worker, accessReq).then(responseCallback);
syncCreateMessenger(receiveMessage).then((onMessageHandler) => {
    if (onMessageHandler) {
        worker = new Worker(debug
            ? libPath + WebWorkerUrl
            : URL.createObjectURL(new Blob([WebWorkerBlob], {
                type: 'text/javascript',
            })), { name: `Partytown 🎉` });
        worker.onmessage = (ev) => {
            const msg = ev.data;
            if (msg[0] === 12 /* WorkerMessageType.AsyncAccessRequest */) {
                // fire and forget async call within web worker
                mainAccessHandler(worker, msg[1]);
            }
            else {
                // blocking call within web worker
                onMessageHandler(worker, msg);
            }
        };
        if (debug) {
            logMain(`Created Partytown web worker (${VERSION})`);
            worker.onerror = (ev) => console.error(`Web Worker Error`, ev);
        }
        mainWindow.addEventListener('pt1', (ev) => registerWindow(worker, getAndSetInstanceId(ev.detail.frameElement), ev.detail));
    }
});
