import { emptyObjectValue, getOriginalBehavior, len, resolvePartytownForwardProperty, } from '../utils';
import '../types';
import { serializeForWorker } from './main-serialization';
export const mainForwardTrigger = (worker, $winId$, win) => {
    let queuedForwardCalls = win._ptf;
    let forwards = (win.partytown || {}).forward || [];
    let i;
    let mainForwardFn;
    let forwardCall = ($forward$, args) => worker.postMessage([
        10 /* WorkerMessageType.ForwardMainTrigger */,
        {
            $winId$,
            $forward$,
            $args$: serializeForWorker($winId$, Array.from(args)),
        },
    ]);
    win._ptf = undefined;
    forwards.map((forwardProps) => {
        const [property, { preserveBehavior }] = resolvePartytownForwardProperty(forwardProps);
        mainForwardFn = win;
        property.split('.').map((_, i, arr) => {
            mainForwardFn = mainForwardFn[arr[i]] =
                i + 1 < len(arr)
                    ? mainForwardFn[arr[i]] || emptyObjectValue(arr[i + 1])
                    : (() => {
                        let originalFunction = null;
                        if (preserveBehavior) {
                            const { methodOrProperty, thisObject } = getOriginalBehavior(win, arr);
                            if (typeof methodOrProperty === 'function') {
                                originalFunction = (...args) => methodOrProperty.apply(thisObject, ...args);
                            }
                        }
                        return (...args) => {
                            let returnValue;
                            if (originalFunction) {
                                returnValue = originalFunction(args);
                            }
                            forwardCall(arr, args);
                            return returnValue;
                        };
                    })();
        });
    });
    if (queuedForwardCalls) {
        for (i = 0; i < len(queuedForwardCalls); i += 2) {
            forwardCall(queuedForwardCalls[i], queuedForwardCalls[i + 1]);
        }
    }
};
