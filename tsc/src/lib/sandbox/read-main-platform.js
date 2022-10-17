import { createElementFromConstructor, getConstructorName, getNodeName, isValidMemberName, len, noop, } from '../utils';
import { config, docImpl, libPath, mainWindow } from './main-globals';
import '../types';
export const readMainPlatform = () => {
    const elm = docImpl.createElement('i');
    const textNode = docImpl.createTextNode('');
    const comment = docImpl.createComment('');
    const frag = docImpl.createDocumentFragment();
    const shadowRoot = docImpl.createElement('p').attachShadow({ mode: 'open' });
    const intersectionObserver = getGlobalConstructor(mainWindow, 'IntersectionObserver');
    const mutationObserver = getGlobalConstructor(mainWindow, 'MutationObserver');
    const resizeObserver = getGlobalConstructor(mainWindow, 'ResizeObserver');
    const perf = mainWindow.performance;
    const screen = mainWindow.screen;
    const impls = [
        // window implementations
        [mainWindow.history],
        [perf],
        [perf.navigation],
        [perf.timing],
        [screen],
        [screen.orientation],
        [mainWindow.visualViewport],
        // global constructors
        [intersectionObserver, 12 /* EnvGlobalConstructor */],
        [mutationObserver, 12 /* EnvGlobalConstructor */],
        [resizeObserver, 12 /* EnvGlobalConstructor */],
        // dom implementations
        [textNode],
        [comment],
        [frag],
        [shadowRoot],
        [elm],
        [elm.attributes],
        [elm.classList],
        [elm.dataset],
        [elm.style],
        [docImpl],
        [docImpl.doctype],
    ];
    const initialInterfaces = [
        readImplementation('Window', mainWindow),
        readImplementation('Node', textNode),
    ];
    const $config$ = JSON.stringify(config, (k, v) => {
        if (typeof v === 'function') {
            v = String(v);
            if (v.startsWith(k + '(')) {
                v = 'function ' + v;
            }
        }
        return v;
    });
    const initWebWorkerData = {
        $config$,
        $interfaces$: readImplementations(impls, initialInterfaces),
        $libPath$: new URL(libPath, mainWindow.location) + '',
        $origin$: origin,
        $localStorage$: readStorage('localStorage'),
        $sessionStorage$: readStorage('sessionStorage'),
    };
    addGlobalConstructorUsingPrototype(initWebWorkerData.$interfaces$, mainWindow, 'IntersectionObserverEntry');
    return initWebWorkerData;
};
export const readMainInterfaces = () => {
    // get all HTML*Element constructors on window
    // and create each element to get their implementation
    const elms = Object.getOwnPropertyNames(mainWindow)
        .map((interfaceName) => createElementFromConstructor(docImpl, interfaceName))
        .filter((elm) => elm)
        .map((elm) => [elm]);
    return readImplementations(elms, []);
};
const cstrs = new Set(['Object']);
const readImplementations = (impls, interfaces) => {
    const cstrImpls = impls
        .filter((implData) => implData[0])
        .map((implData) => {
        const impl = implData[0];
        const interfaceType = implData[1];
        const cstrName = getConstructorName(impl);
        const CstrPrototype = mainWindow[cstrName].prototype;
        return [cstrName, CstrPrototype, impl, interfaceType];
    });
    cstrImpls.map(([cstrName, CstrPrototype, impl, intefaceType]) => readOwnImplementation(cstrs, interfaces, cstrName, CstrPrototype, impl, intefaceType));
    return interfaces;
};
const readImplementation = (cstrName, impl, memberName) => {
    let interfaceMembers = [];
    let interfaceInfo = [cstrName, 'Object', interfaceMembers];
    for (memberName in impl) {
        readImplementationMember(interfaceMembers, impl, memberName);
    }
    return interfaceInfo;
};
const readOwnImplementation = (cstrs, interfaces, cstrName, CstrPrototype, impl, interfaceType) => {
    if (!cstrs.has(cstrName)) {
        cstrs.add(cstrName);
        const SuperCstr = Object.getPrototypeOf(CstrPrototype);
        const superCstrName = getConstructorName(SuperCstr);
        const interfaceMembers = [];
        const propDescriptors = Object.getOwnPropertyDescriptors(CstrPrototype);
        readOwnImplementation(cstrs, interfaces, superCstrName, SuperCstr, impl, interfaceType);
        for (const memberName in propDescriptors) {
            readImplementationMember(interfaceMembers, impl, memberName);
        }
        interfaces.push([cstrName, superCstrName, interfaceMembers, interfaceType, getNodeName(impl)]);
    }
};
const readImplementationMember = (interfaceMembers, implementation, memberName, value, memberType, cstrName) => {
    try {
        if (isValidMemberName(memberName) && isNaN(memberName[0]) && memberName !== 'all') {
            value = implementation[memberName];
            memberType = typeof value;
            if (memberType === 'function') {
                if (String(value).includes(`[native`) ||
                    Object.getPrototypeOf(implementation)[memberName]) {
                    interfaceMembers.push([memberName, 5 /* Function */]);
                }
            }
            else if (memberType === 'object' && value != null) {
                cstrName = getConstructorName(value);
                if (cstrName !== 'Object' && self[cstrName]) {
                    interfaceMembers.push([memberName, value.nodeType || cstrName]);
                }
            }
            else if (memberType !== 'symbol') {
                // everything else that's not a symbol
                if (memberName.toUpperCase() === memberName) {
                    // static property, let's get its value
                    interfaceMembers.push([memberName, 6 /* Property */, value]);
                }
                else {
                    interfaceMembers.push([memberName, 6 /* Property */]);
                }
            }
        }
    }
    catch (e) {
        console.warn(e);
    }
};
const readStorage = (storageName) => {
    let items = [];
    let i = 0;
    let l = len(mainWindow[storageName]);
    let key;
    for (; i < l; i++) {
        key = mainWindow[storageName].key(i);
        items.push([key, mainWindow[storageName].getItem(key)]);
    }
    return items;
};
const getGlobalConstructor = (mainWindow, cstrName) => typeof mainWindow[cstrName] !== 'undefined' ? new mainWindow[cstrName](noop) : 0;
const addGlobalConstructorUsingPrototype = ($interfaces$, mainWindow, cstrName) => {
    if (typeof mainWindow[cstrName] !== 'undefined') {
        // we don't have an actual implementation, only the prototype
        // so let's just read what props exist, and assume they're all values, not functions
        $interfaces$.push([
            cstrName,
            'Object',
            Object.keys(mainWindow[cstrName].prototype).map((propName) => [
                propName,
                6 /* Property */,
            ]),
            12 /* EnvGlobalConstructor */,
        ]);
    }
};
