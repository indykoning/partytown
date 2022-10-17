import { initializedWorkerScript, readNextScript } from './read-main-scripts';
import { mainWindow } from './main-globals';
import '../types';
import { randomId } from '../utils';
import { registerWindow } from './main-register-window';
import { winCtxs } from './main-constants';
export const onMessageFromWebWorker = (worker, msg, winCtx) => {
    if (msg[0] === 4 /* InitializedWebWorker */) {
        // web worker has finished initializing and ready to run scripts
        registerWindow(worker, randomId(), mainWindow);
    }
    else {
        winCtx = winCtxs[msg[1]];
        if (winCtx) {
            if (msg[0] === 7 /* InitializeNextScript */) {
                // web worker has been initialized with the main data
                requestAnimationFrame(() => readNextScript(worker, winCtx));
            }
            else if (msg[0] === 6 /* InitializedEnvironmentScript */) {
                // web worker has finished initializing the script, and has another one to do
                // doing this postMessage back-and-forth so we don't have long running tasks
                initializedWorkerScript(worker, winCtx, msg[2], msg[3]);
            }
        }
    }
};
