import './types';
import { ApplyPathKey, InstanceDataKey, InstanceIdKey, webWorkerCtx, WinIdKey, } from './web-worker/worker-constants';
import { debug, getConstructorName, isPromise } from './utils';
export const warnCrossOrgin = (apiType, apiName, env) => console.warn(`Partytown unable to ${apiType} cross-origin ${apiName}: ` + env.$location$);
export const logMain = (msg) => {
    if (debug) {
        console.debug.apply(console, [
            `%cMain 🌎`,
            `background: #717171; color: white; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;`,
            msg,
        ]);
    }
};
export const logWorker = (msg, winId) => {
    if (debug) {
        try {
            const config = webWorkerCtx.$config$;
            if (config.logStackTraces) {
                const frames = new Error().stack.split('\n');
                const i = frames.findIndex((f) => f.includes('logWorker'));
                msg += '\n' + frames.slice(i + 1).join('\n');
            }
            let prefix;
            let color;
            if (winId) {
                prefix = `Worker (${normalizedWinId(winId)}) 🎉`;
                color = winColor(winId);
            }
            else {
                prefix = self.name;
                color = `#9844bf`;
            }
            if (webWorkerCtx.lastLog !== msg) {
                webWorkerCtx.lastLog = msg;
                console.debug.apply(console, [
                    `%c${prefix}`,
                    `background: ${color}; color: white; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;`,
                    msg,
                ]);
            }
        }
        catch (e) { }
    }
};
const winIds = [];
export const normalizedWinId = (winId) => {
    if (!winIds.includes(winId)) {
        winIds.push(winId);
    }
    return winIds.indexOf(winId) + 1;
};
const winColor = (winId) => {
    const colors = ['#00309e', '#ea3655', '#eea727'];
    const index = normalizedWinId(winId) - 1;
    return colors[index] || colors[colors.length - 1];
};
export const logWorkerGetter = (target, applyPath, rtnValue, restrictedToWorker = false, groupedGetters = false) => {
    if (debug && webWorkerCtx.$config$.logGetters) {
        try {
            const msg = `Get ${getTargetProp(target, applyPath)}, returned: ${getLogValue(applyPath, rtnValue)}${restrictedToWorker ? ' (restricted to worker)' : ''}${groupedGetters ? ' (grouped getter)' : ''}`;
            if (!msg.includes('Symbol(')) {
                logWorker(msg, target[WinIdKey]);
            }
        }
        catch (e) { }
    }
};
export const logWorkerSetter = (target, applyPath, value, restrictedToWorker = false) => {
    if (debug && webWorkerCtx.$config$.logSetters) {
        try {
            applyPath = applyPath.slice(0, applyPath.length - 2);
            logWorker(`Set ${getTargetProp(target, applyPath)}, value: ${getLogValue(applyPath, value)}${restrictedToWorker ? ' (restricted to worker)' : ''}`, target[WinIdKey]);
        }
        catch (e) { }
    }
};
export const logWorkerCall = (target, applyPath, args, rtnValue) => {
    if (debug && webWorkerCtx.$config$.logCalls) {
        try {
            applyPath = applyPath.slice(0, applyPath.length - 1);
            logWorker(`Call ${getTargetProp(target, applyPath)}(${args
                .map((v) => getLogValue(applyPath, v))
                .join(', ')}), returned: ${getLogValue(applyPath, rtnValue)}`, target[WinIdKey]);
        }
        catch (e) { }
    }
};
export const logWorkerGlobalConstructor = (target, cstrName, args) => {
    if (debug && webWorkerCtx.$config$.logCalls) {
        try {
            logWorker(`Construct new ${cstrName}(${args.map((v) => getLogValue([], v)).join(', ')})`, target[WinIdKey]);
        }
        catch (e) { }
    }
};
const getTargetProp = (target, applyPath) => {
    let n = '';
    if (target) {
        const cstrName = getConstructorName(target);
        if (cstrName === 'Window') {
            n = '';
        }
        else if (typeof target[InstanceDataKey] === 'string') {
            let nodeName = target[InstanceDataKey];
            if (nodeName === "#text" /* Text */) {
                n = 'textNode.';
            }
            else if (nodeName === "#comment" /* Comment */) {
                n = 'commentNode.';
            }
            else if (nodeName === "#document" /* Document */) {
                n = 'document.';
            }
            else if (nodeName === "html" /* DocumentTypeNode */) {
                n = 'doctype.';
            }
            else {
                n = nodeName.toLowerCase() + '.';
            }
        }
        else if ('nodeType' in target && target.nodeType === 2 /* AttributeNode */) {
            n = 'attributes.';
        }
        else if (cstrName === 'CanvasRenderingContext2D') {
            n = 'context2D.';
        }
        else if (cstrName === 'CanvasRenderingContextWebGL') {
            n = 'contextWebGL.';
        }
        else if (cstrName === 'CSSStyleDeclaration') {
            n = 'style.';
        }
        else if (cstrName === 'MutationObserver') {
            n = 'mutationObserver.';
        }
        else if (cstrName === 'NamedNodeMap') {
            n = 'namedNodeMap.';
        }
        else if (cstrName === 'ResizeObserver') {
            n = 'resizeObserver.';
        }
        else {
            n = cstrName.substring(0, 1).toLowerCase() + cstrName.substring(1) + '.';
        }
        if (target[ApplyPathKey] && target[ApplyPathKey].length) {
            n += [...target[ApplyPathKey]].join('.') + '.';
        }
    }
    if (applyPath.length > 1) {
        const first = applyPath.slice(0, applyPath.length - 1);
        const last = applyPath[applyPath.length - 1];
        if (!isNaN(last)) {
            return (n += `${first.join('.')}[${last}]`);
        }
    }
    return (n += applyPath.join('.'));
};
/**
 * Helper just to have pretty console logs while debugging
 */
const getLogValue = (applyPath, v) => {
    const type = typeof v;
    if (v === undefined) {
        return 'undefined';
    }
    if (type === 'boolean' || type === 'number' || v == null) {
        return JSON.stringify(v);
    }
    if (type === 'string') {
        if (applyPath.includes('cookie')) {
            return JSON.stringify(v.slice(0, 10) + '...');
        }
        return JSON.stringify(v.length > 50 ? v.slice(0, 40) + '...' : v);
    }
    if (Array.isArray(v)) {
        return `[${v.map(getLogValue).join(', ')}]`;
    }
    if (type === 'object') {
        const instanceId = v[InstanceIdKey];
        const cstrName = getConstructorName(v);
        if (typeof instanceId === 'string') {
            if (cstrName === 'Window') {
                return `window`;
            }
            if (typeof v[InstanceDataKey] === 'string') {
                if (v.nodeType === 1) {
                    return `<${v[InstanceDataKey].toLowerCase()}>`;
                }
                if (v.nodeType === 10 /* DocumentTypeNode */) {
                    return `<!DOCTYPE ${v[InstanceDataKey]}>`;
                }
                if (v.nodeType <= 11 /* DocumentFragmentNode */) {
                    return v[InstanceDataKey];
                }
            }
            return '¯\\_(ツ)_/¯ instance obj';
        }
        if (v[Symbol.iterator]) {
            return `[${Array.from(v)
                .map((i) => getLogValue(applyPath, i))
                .join(', ')}]`;
        }
        if ('value' in v) {
            if (typeof v.value === 'string') {
                return `"${v.value}"`;
            }
            return objToString(v.value);
        }
        return objToString(v);
    }
    if (isPromise(v)) {
        return `Promise`;
    }
    if (type === 'function') {
        return `ƒ() ${v.name || ''}`.trim();
    }
    return `¯\\_(ツ)_/¯ ${String(v)}`.trim();
};
const objToString = (obj) => {
    const s = [];
    for (let key in obj) {
        const value = obj[key];
        const type = typeof value;
        if (type === 'string') {
            s.push(`${key}: "${value}"`);
        }
        else if (type === 'function') {
            s.push(`${key}: ƒ`);
        }
        else if (Array.isArray(type)) {
            s.push(`${key}: [..]`);
        }
        else if (type === 'object' && value) {
            s.push(`${key}: {..}`);
        }
        else {
            s.push(`${key}: ${String(value)}`);
        }
    }
    let str = s.join(', ');
    if (str.length > 200) {
        str = str.substring(0, 200) + '..';
    }
    return `{ ${str} }`;
};
export const logDimensionCacheClearSetter = (target, propName) => {
    if (debug && (webWorkerCtx.$config$.logGetters || webWorkerCtx.$config$.logSetters)) {
        logWorker(`Dimension cache cleared from setter "${propName}"`, target[WinIdKey]);
    }
};
export const logDimensionCacheClearStyle = (target, propName) => {
    if (debug && (webWorkerCtx.$config$.logGetters || webWorkerCtx.$config$.logSetters)) {
        logWorker(`Dimension cache cleared from style.${propName} setter`, target[WinIdKey]);
    }
};
export const logDimensionCacheClearMethod = (target, methodName) => {
    if (debug && (webWorkerCtx.$config$.logGetters || webWorkerCtx.$config$.logCalls)) {
        logWorker(`Dimension cache cleared from method call ${methodName}()`, target[WinIdKey]);
    }
};
export const logCacheClearMethod = (target, methodName) => {
    if (debug && (webWorkerCtx.$config$.logGetters || webWorkerCtx.$config$.logCalls)) {
        logWorker(`Dimension and DOM structure cache cleared from method call ${methodName}()`, target[WinIdKey]);
    }
};
export const taskDebugInfo = (target, applyPath, callType) => {
    let m = getTargetProp(target, applyPath);
    if (callType === 1 /* Blocking */) {
        m += ' (blocking)';
    }
    else if (callType === 2 /* NonBlocking */) {
        m += ' (non-blocking)';
    }
    else if (callType === 3 /* NonBlockingNoSideEffect */) {
        m += ' (non-blocking, no-side-effect)';
    }
    return m.trim();
};
