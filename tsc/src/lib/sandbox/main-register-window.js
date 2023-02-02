import { debug } from '../utils';
import { logMain, normalizedWinId } from '../log';
import '../types';
import { winCtxs, windowIds } from './main-constants';
import { readNextScript } from './read-main-scripts';
export const registerWindow = (worker, $winId$, $window$) => {
    if (!windowIds.has($window$)) {
        windowIds.set($window$, $winId$);
        const doc = $window$.document;
        const history = $window$.history;
        const $parentWinId$ = windowIds.get($window$.parent);
        let initialised = false;
        const onInitialisedQueue = [];
        const onInitialised = (callback) => {
            if (initialised) {
                callback();
            }
            else {
                onInitialisedQueue.push(callback);
            }
        };
        const sendInitEnvData = () => {
            worker.postMessage([
                5 /* InitializeEnvironment */,
                {
                    $winId$,
                    $parentWinId$,
                    $url$: doc.baseURI,
                    $visibilityState$: doc.visibilityState,
                },
            ]);
            // Timeout to call postpone second after init message
            setTimeout(() => {
                initialised = true;
                onInitialisedQueue.forEach((callback) => {
                    callback();
                });
            });
        };
        const pushState = history.pushState.bind(history);
        const replaceState = history.replaceState.bind(history);
        const onLocationChange = (type, state, newUrl, oldUrl) => () => {
            setTimeout(() => {
                worker.postMessage([
                    13 /* LocationUpdate */,
                    {
                        $winId$,
                        type,
                        state,
                        url: doc.baseURI,
                        newUrl,
                        oldUrl,
                    },
                ]);
            });
        };
        history.pushState = (state, _, newUrl) => {
            pushState(state, _, newUrl);
            onInitialised(onLocationChange(0 /* PushState */, state, newUrl === null || newUrl === void 0 ? void 0 : newUrl.toString()));
        };
        history.replaceState = (state, _, newUrl) => {
            replaceState(state, _, newUrl);
            onInitialised(onLocationChange(1 /* ReplaceState */, state, newUrl === null || newUrl === void 0 ? void 0 : newUrl.toString()));
        };
        $window$.addEventListener('popstate', (event) => {
            onInitialised(onLocationChange(2 /* PopState */, event.state));
        });
        $window$.addEventListener('hashchange', (event) => {
            onInitialised(onLocationChange(3 /* HashChange */, {}, event.newURL, event.oldURL));
        });
        $window$.addEventListener('ptupdate', () => {
            readNextScript(worker, winCtxs[$winId$]);
        });
        doc.addEventListener('visibilitychange', () => worker.postMessage([14 /* DocumentVisibilityState */, $winId$, doc.visibilityState]));
        winCtxs[$winId$] = {
            $winId$,
            $window$,
        };
        if (debug) {
            winCtxs[$winId$].$startTime$ = performance.now();
        }
        if (debug) {
            const winType = $winId$ === $parentWinId$ ? 'top' : 'iframe';
            logMain(`Registered ${winType} window ${normalizedWinId($winId$)}`);
        }
        if (doc.readyState === 'complete') {
            sendInitEnvData();
        }
        else {
            $window$.addEventListener('load', sendInitEnvData);
        }
    }
};
