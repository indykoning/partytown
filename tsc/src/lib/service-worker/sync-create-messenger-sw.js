import '../types';
import { onMessageFromWebWorker } from '../sandbox/on-messenge-from-worker';
import { readMainInterfaces, readMainPlatform } from '../sandbox/read-main-platform';
const createMessengerServiceWorker = (receiveMessage) => {
    const swContainer = window.navigator.serviceWorker;
    return swContainer.getRegistration().then((swRegistration) => {
        swContainer.addEventListener('message', (ev) => receiveMessage(ev.data, (accessRsp) => swRegistration.active && swRegistration.active.postMessage(accessRsp)));
        return (worker, msg) => {
            if (msg[0] === 0 /* MainDataRequestFromWorker */) {
                // web worker has requested the initial data from the main thread
                // collect up info about the main thread interfaces
                // send the main thread interface data to the web worker
                worker.postMessage([1 /* MainDataResponseToWorker */, readMainPlatform()]);
            }
            else if (msg[0] === 2 /* MainInterfacesRequestFromWorker */) {
                // web worker has requested the rest of the html/svg interfaces
                worker.postMessage([
                    3 /* MainInterfacesResponseToWorker */,
                    readMainInterfaces(),
                ]);
            }
            else {
                onMessageFromWebWorker(worker, msg);
            }
        };
    });
};
export default createMessengerServiceWorker;
