import { createWindow } from './worker-window';
import { debug } from '../utils';
import { environments, webWorkerCtx } from './worker-constants';
import '../types';
import { logWorker, normalizedWinId } from '../log';
export const createEnvironment = ({ $winId$, $parentWinId$, $url$, $visibilityState$ }, isIframeWindow, isDocumentImplementation) => {
    if (!environments[$winId$]) {
        // create a simulated global environment for this window
        // if it hasn't already been created (like an iframe)
        environments[$winId$] = createWindow($winId$, $parentWinId$, $url$, $visibilityState$, isIframeWindow, isDocumentImplementation);
        if (debug) {
            const winType = $winId$ === $parentWinId$ ? 'top' : 'iframe';
            logWorker(`Created ${winType} window ${normalizedWinId($winId$)} environment`, $winId$);
        }
    }
    webWorkerCtx.$postMessage$([7 /* WorkerMessageType.InitializeNextScript */, $winId$]);
    return environments[$winId$];
};
