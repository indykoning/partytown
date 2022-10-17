export const WinIdKey = /*#__PURE__*/ Symbol();
export const InstanceIdKey = /*#__PURE__*/ Symbol();
export const InstanceDataKey = /*#__PURE__*/ Symbol();
export const NamespaceKey = /*#__PURE__*/ Symbol();
export const ApplyPathKey = /*#__PURE__*/ Symbol();
export const InstanceStateKey = /*#__PURE__*/ Symbol();
export const HookContinue = /*#__PURE__*/ Symbol();
export const HookPrevent = /*#__PURE__*/ Symbol();
export const webWorkerInstances = /*#__PURE__*/ new Map();
export const webWorkerRefsByRefId = {};
export const webWorkerRefIdsByRef = /*#__PURE__*/ new WeakMap();
export const postMessages = [];
export const webWorkerCtx = {};
export const webWorkerInterfaces = [];
export const webWorkerlocalStorage = /*#__PURE__*/ new Map();
export const webWorkerSessionStorage = /*#__PURE__*/ new Map();
export const environments = {};
export const cachedDimensions = /*#__PURE__*/ new Map();
export const cachedStructure = /*#__PURE__*/ new Map();
export const ABOUT_BLANK = 'about:blank';
export const commaSplit = (str) => str.split(',');
export const partytownLibUrl = (url) => {
    url = webWorkerCtx.$libPath$ + url;
    if (new URL(url).origin != location.origin) {
        throw 'Invalid ' + url;
    }
    return url;
};
/** property getters for dimensions */
export const getterDimensionPropNames = /*#__PURE__*/ commaSplit('clientWidth,clientHeight,clientTop,clientLeft,innerWidth,innerHeight,offsetWidth,offsetHeight,offsetTop,offsetLeft,outerWidth,outerHeight,pageXOffset,pageYOffset,scrollWidth,scrollHeight,scrollTop,scrollLeft');
/** element properties in regards to the DOM structure */
export const elementStructurePropNames = /*#__PURE__*/ commaSplit('childElementCount,children,firstElementChild,lastElementChild,nextElementSibling,previousElementSibling');
/** methods that could change the DOM structure */
export const structureChangingMethodNames = /*#__PURE__*/ commaSplit('insertBefore,remove,removeChild,replaceChild');
/** setters that could change dimensions of elements */
export const dimensionChangingSetterNames = /*#__PURE__*/ commaSplit('className,width,height,hidden,innerHTML,innerText,textContent');
/** method calls that could change dimensions of elements */
export const dimensionChangingMethodNames = /*#__PURE__*/ commaSplit('setAttribute,setAttributeNS,setProperty');
export const eventTargetMethods = /*#__PURE__*/ commaSplit('addEventListener,dispatchEvent,removeEventListener');
export const nonBlockingMethods = /*#__PURE__*/ eventTargetMethods.concat(dimensionChangingMethodNames, 
/*#__PURE__*/ commaSplit('add,observe,remove,unobserve'));
export const IS_TAG_REG = /^[A-Z_]([A-Z0-9-]*[A-Z0-9])?$/;
