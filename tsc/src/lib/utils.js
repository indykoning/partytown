export const debug = !!globalThis.partytownDebug;
export const isPromise = (v) => typeof v === 'object' && v && v.then;
export const noop = () => { };
export const len = (obj) => obj.length;
export const getConstructorName = (obj) => {
    var _a, _b, _c;
    try {
        const constructorName = (_a = obj === null || obj === void 0 ? void 0 : obj.constructor) === null || _a === void 0 ? void 0 : _a.name;
        if (constructorName)
            return constructorName;
    }
    catch (e) { }
    try {
        const zoneJsConstructorName = (_c = (_b = obj === null || obj === void 0 ? void 0 : obj.__zone_symbol__originalInstance) === null || _b === void 0 ? void 0 : _b.constructor) === null || _c === void 0 ? void 0 : _c.name;
        if (zoneJsConstructorName)
            return zoneJsConstructorName;
    }
    catch (e) { }
    return '';
};
export const startsWith = (str, val) => str.startsWith(val);
export const isValidMemberName = (memberName) => !(startsWith(memberName, 'webkit') ||
    startsWith(memberName, 'toJSON') ||
    startsWith(memberName, 'constructor') ||
    startsWith(memberName, 'toString') ||
    startsWith(memberName, '_'));
export const getLastMemberName = (applyPath, i) => {
    for (i = len(applyPath) - 1; i >= 0; i--) {
        if (typeof applyPath[i] === 'string') {
            return applyPath[i];
        }
    }
    return applyPath[0];
};
export const getNodeName = (node) => node.nodeType === 11 && node.host ? '#s' : node.nodeName;
export const EMPTY_ARRAY = [];
if (debug) {
    /*#__PURE__*/ Object.freeze(EMPTY_ARRAY);
}
export const randomId = () => Math.round(Math.random() * Number.MAX_SAFE_INTEGER).toString(36);
/**
 * The `type` attribute for Partytown scripts, which does two things:
 *
 * 1. Prevents the `<script>` from executing on the main thread.
 * 2. Is used as a selector so the Partytown library can find all scripts to execute in a web worker.
 *
 * @public
 */
export const SCRIPT_TYPE = `text/partytown`;
export const SCRIPT_TYPE_EXEC = `-x`;
export const defineProperty = (obj, memberName, descriptor) => Object.defineProperty(obj, memberName, { ...descriptor, configurable: true });
export const defineConstructorName = (Cstr, value) => defineProperty(Cstr, 'name', {
    value,
});
export const definePrototypeProperty = (Cstr, memberName, descriptor) => defineProperty(Cstr.prototype, memberName, descriptor);
export const definePrototypePropertyDescriptor = (Cstr, propertyDescriptorMap) => Object.defineProperties(Cstr.prototype, propertyDescriptorMap);
export const definePrototypeValue = (Cstr, memberName, value) => definePrototypeProperty(Cstr, memberName, {
    value,
    writable: true,
});
const htmlConstructorTags = {
    Anchor: 'a',
    DList: 'dl',
    Image: 'img',
    OList: 'ol',
    Paragraph: 'p',
    Quote: 'q',
    TableCaption: 'caption',
    TableCell: 'td',
    TableCol: 'colgroup',
    TableRow: 'tr',
    TableSection: 'tbody',
    UList: 'ul',
};
const svgConstructorTags = {
    Graphics: 'g',
    SVG: 'svg',
};
export const createElementFromConstructor = (doc, interfaceName, r, tag) => {
    r = interfaceName.match(/^(HTML|SVG)(.+)Element$/);
    if (r) {
        tag = r[2];
        return interfaceName[0] == 'S'
            ? doc.createElementNS('http://www.w3.org/2000/svg', svgConstructorTags[tag] || tag.slice(0, 2).toLowerCase() + tag.slice(2))
            : doc.createElement(htmlConstructorTags[tag] || tag);
    }
};
export const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    }
    catch (_) {
        return false;
    }
};
const defaultPartytownForwardPropertySettings = {
    preserveBehavior: false,
};
export const resolvePartytownForwardProperty = (propertyOrPropertyWithSettings) => {
    if (typeof propertyOrPropertyWithSettings === 'string') {
        return [propertyOrPropertyWithSettings, defaultPartytownForwardPropertySettings];
    }
    const [property, settings = defaultPartytownForwardPropertySettings] = propertyOrPropertyWithSettings;
    return [property, { ...defaultPartytownForwardPropertySettings, ...settings }];
};
export const getOriginalBehavior = (window, properties) => {
    let thisObject = window;
    for (let i = 0; i < properties.length - 1; i += 1) {
        thisObject = thisObject[properties[i]];
    }
    return {
        thisObject,
        methodOrProperty: properties.length > 0 ? thisObject[properties[properties.length - 1]] : undefined,
    };
};
const getMethods = (obj) => {
    const properties = new Set();
    let currentObj = obj;
    do {
        Object.getOwnPropertyNames(currentObj).forEach((item) => {
            if (typeof currentObj[item] === 'function') {
                properties.add(item);
            }
        });
    } while ((currentObj = Object.getPrototypeOf(currentObj)) !== Object.prototype);
    return Array.from(properties);
};
const arrayMethods = Object.freeze(getMethods([]));
export const emptyObjectValue = (propertyName) => {
    if (arrayMethods.includes(propertyName)) {
        return [];
    }
    return {};
};
function escapeRegExp(input) {
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
export function testIfMustLoadScriptOnMainThread(config, value) {
    var _a, _b;
    return ((_b = (_a = config.loadScriptsOnMainThread) === null || _a === void 0 ? void 0 : _a.map(([type, value]) => new RegExp(type === 'string' ? escapeRegExp(value) : value)).some((regexp) => regexp.test(value))) !== null && _b !== void 0 ? _b : false);
}
export function serializeConfig(config) {
    return JSON.stringify(config, (key, value) => {
        if (typeof value === 'function') {
            value = String(value);
            if (value.startsWith(key + '(')) {
                value = 'function ' + value;
            }
        }
        if (key === 'loadScriptsOnMainThread') {
            value = value.map((scriptUrl) => Array.isArray(scriptUrl)
                ? scriptUrl
                : [
                    typeof scriptUrl === 'string' ? 'string' : 'regexp',
                    typeof scriptUrl === 'string' ? scriptUrl : scriptUrl.source,
                ]);
        }
        return value;
    });
}
