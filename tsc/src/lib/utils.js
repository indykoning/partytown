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
