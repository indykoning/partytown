import { debug } from '../utils';
import { logWorker } from '../log';
import { resolveUrl } from './worker-exec';
import { webWorkerCtx } from './worker-constants';
export const createNavigator = (env) => {
    let key;
    let nav = {
        sendBeacon: (url, body) => {
            if (debug && webWorkerCtx.$config$.logSendBeaconRequests) {
                try {
                    logWorker(`sendBeacon: ${resolveUrl(env, url, null)}${body ? ', data: ' + JSON.stringify(body) : ''}`);
                }
                catch (e) {
                    console.error(e);
                }
            }
            try {
                fetch(resolveUrl(env, url, null), {
                    method: 'POST',
                    body,
                    mode: 'no-cors',
                    keepalive: true,
                });
                return true;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        },
    };
    for (key in navigator) {
        nav[key] = navigator[key];
    }
    return new Proxy(nav, {
        set(_, propName, propValue) {
            navigator[propName] = propValue;
            return true;
        },
    });
};
