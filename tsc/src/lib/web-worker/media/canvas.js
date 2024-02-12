import { ApplyPathKey, InstanceIdKey, WinIdKey, callMethod, setter, definePrototypePropertyDescriptor, randomId, } from './bridge';
import { ContextKey, defineCstr, notImpl } from './utils';
import '../../types';
export const initCanvas = (WorkerBase, win) => {
    const HTMLCanvasDescriptorMap = {
        getContext: {
            value(contextType, contextAttributes) {
                // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
                if (!this[ContextKey]) {
                    this[ContextKey] = (contextType.includes('webgl') ? createContextWebGL : createContext2D)(this, contextType, contextAttributes);
                }
                return this[ContextKey];
            },
        },
    };
    const WorkerCanvasGradient = defineCstr(win, 'CanvasGradient', class extends WorkerBase {
        addColorStop(...args) {
            callMethod(this, ['addColorStop'], args, 2 /* CallType.NonBlocking */);
        }
    });
    const WorkerCanvasPattern = defineCstr(win, 'CanvasPattern', class extends WorkerBase {
        setTransform(...args) {
            callMethod(this, ['setTransform'], args, 2 /* CallType.NonBlocking */);
        }
    });
    const createContext2D = (canvasInstance, contextType, contextAttributes) => {
        // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        const winId = canvasInstance[WinIdKey];
        const ctxInstanceId = randomId();
        const ctxInstance = { [WinIdKey]: winId, [InstanceIdKey]: ctxInstanceId, [ApplyPathKey]: [] };
        const ctx = callMethod(canvasInstance, ['getContext'], [contextType, contextAttributes], 1 /* CallType.Blocking */, ctxInstanceId);
        const ctx2dGetterMethods = 'getContextAttributes,getImageData,getLineDash,getTransform,isPointInPath,isPointInStroke,measureText'.split(',');
        const CanvasRenderingContext2D = {
            get(target, propName) {
                if (typeof propName === 'string' && propName in ctx) {
                    if (typeof ctx[propName] === 'function') {
                        // context method
                        return (...args) => {
                            if (propName.startsWith('create')) {
                                // createConicGradient,createImageData,createLinearGradient,createPattern,createRadialGradient
                                // getter method, remember the instance
                                const instanceId = randomId();
                                callMethod(ctxInstance, [propName], args, 2 /* CallType.NonBlocking */, instanceId);
                                if (propName === 'createImageData' || propName === 'createPattern') {
                                    notImpl(`${propName}()`);
                                    return { setTransform: () => { } };
                                }
                                // createConicGradient,createLinearGradient,createRadialGradient
                                return new WorkerCanvasGradient(winId, instanceId);
                            }
                            // context method
                            const methodCallType = ctx2dGetterMethods.includes(propName)
                                ? 1 /* CallType.Blocking */
                                : 2 /* CallType.NonBlocking */;
                            return callMethod(ctxInstance, [propName], args, methodCallType);
                        };
                    }
                    // context prop getter
                    return ctx[propName];
                }
                // symbol prop getter
                return target[propName];
            },
            set(target, propName, value) {
                if (typeof propName === 'string' && propName in ctx) {
                    // context prop setter
                    if (ctx[propName] !== value && typeof value !== 'function') {
                        setter(ctxInstance, [propName], value);
                    }
                    ctx[propName] = value;
                }
                else {
                    target[propName] = value;
                }
                return true;
            },
        };
        return new Proxy(ctx, CanvasRenderingContext2D);
    };
    const createContextWebGL = (canvasInstance, contextType, contextAttributes) => {
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext
        const winId = canvasInstance[WinIdKey];
        const ctxInstanceId = randomId();
        const ctxInstance = { [WinIdKey]: winId, [InstanceIdKey]: ctxInstanceId, [ApplyPathKey]: [] };
        const ctx = callMethod(canvasInstance, ['getContext'], [contextType, contextAttributes], 1 /* CallType.Blocking */, ctxInstanceId);
        const WebGLRenderingContextHandler = {
            get(target, propName) {
                if (typeof propName === 'string') {
                    if (typeof ctx[propName] !== 'function') {
                        // context prop getter
                        return ctx[propName];
                    }
                    // context method
                    return (...args) => {
                        return callMethod(ctxInstance, [propName], args, getWebGlMethodCallType(propName));
                    };
                }
                // symbol prop getter
                return target[propName];
            },
            set(target, propName, value) {
                if (typeof propName === 'string' && propName in ctx) {
                    // context prop setter
                    if (ctx[propName] !== value && typeof value !== 'function') {
                        setter(ctxInstance, [propName], value);
                    }
                    ctx[propName] = value;
                }
                else {
                    target[propName] = value;
                }
                return true;
            },
        };
        return new Proxy(ctx, WebGLRenderingContextHandler);
    };
    const ctxWebGLGetterMethods = 'checkFramebufferStatus,makeXRCompatible'.split(',');
    const getWebGlMethodCallType = (methodName) => methodName.startsWith('create') ||
        methodName.startsWith('get') ||
        methodName.startsWith('is') ||
        ctxWebGLGetterMethods.includes(methodName)
        ? 1 /* CallType.Blocking */
        : 2 /* CallType.NonBlocking */;
    defineCstr(win, 'CanvasGradient', WorkerCanvasGradient);
    defineCstr(win, 'CanvasPattern', WorkerCanvasPattern);
    definePrototypePropertyDescriptor(win.HTMLCanvasElement, HTMLCanvasDescriptorMap);
};
