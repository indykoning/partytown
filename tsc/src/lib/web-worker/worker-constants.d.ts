import type { InterfaceInfo, PostMessageData, RefHandler, RefId, StorageItem, WebWorkerContext, WebWorkerEnvironment, WinId, WorkerNode } from '../types';
export declare const WinIdKey: unique symbol;
export declare const InstanceIdKey: unique symbol;
export declare const InstanceDataKey: unique symbol;
export declare const NamespaceKey: unique symbol;
export declare const ApplyPathKey: unique symbol;
export declare const InstanceStateKey: unique symbol;
export declare const HookContinue: unique symbol;
export declare const HookPrevent: unique symbol;
export declare const webWorkerInstances: Map<string, WorkerNode>;
export declare const webWorkerRefsByRefId: {
    [refId: RefId]: RefHandler;
};
export declare const webWorkerRefIdsByRef: WeakMap<RefHandler, string>;
export declare const postMessages: PostMessageData[];
export declare const webWorkerCtx: WebWorkerContext;
export declare const webWorkerInterfaces: InterfaceInfo[];
export declare const webWorkerlocalStorage: Map<string, StorageItem[]>;
export declare const webWorkerSessionStorage: Map<string, StorageItem[]>;
export declare const environments: {
    [winId: WinId]: WebWorkerEnvironment;
};
export declare const cachedDimensions: Map<string, any>;
export declare const cachedStructure: Map<string, any>;
export declare const ABOUT_BLANK = "about:blank";
export declare const commaSplit: (str: string) => string[];
export declare const partytownLibUrl: (url: string) => string;
/** property getters for dimensions */
export declare const getterDimensionPropNames: string[];
/** element properties in regards to the DOM structure */
export declare const elementStructurePropNames: string[];
/** methods that could change the DOM structure */
export declare const structureChangingMethodNames: string[];
/** setters that could change dimensions of elements */
export declare const dimensionChangingSetterNames: string[];
/** method calls that could change dimensions of elements */
export declare const dimensionChangingMethodNames: string[];
export declare const eventTargetMethods: string[];
export declare const nonBlockingMethods: string[];
export declare const IS_TAG_REG: RegExp;
