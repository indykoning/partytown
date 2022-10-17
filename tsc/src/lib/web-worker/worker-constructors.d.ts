import type { InstanceId, WinId, WorkerNode } from '../types';
export declare const getOrCreateNodeInstance: (winId: WinId, instanceId: InstanceId, nodeName?: string | undefined, namespace?: string | undefined, instance?: WorkerNode | undefined) => WorkerNode | undefined;
export declare const definePrototypeNodeType: (Cstr: any, nodeType: number) => any;
export declare const cachedTreeProps: (Cstr: any, treeProps: string[]) => any[];
/**
 * Properties to add to the Constructor's prototype
 * that should only do a main read once, cache the value, and
 * returned the cached value after in subsequent reads after that.
 * A setter will update the cache.
 */
export declare const cachedProps: (Cstr: any, propNames: string) => any[];
/**
 * Properties that always return a value, without doing a main access.
 * Same as:
 * get propName() { return propValue }
 */
export declare const constantProps: (Cstr: any, props: {
    [propName: string]: any;
}) => any[];
/**
 * Known dimension properties to add to the Constructor's prototype
 * that when called they'll check the dimension cache, and if it's
 * not in the cache then to get all dimensions in one call and
 * set its cache. The dimension cache is cleared when another method is called.
 */
export declare const cachedDimensionProps: (Cstr: any) => any[];
/**
 * Methods that return dimensions that can be cached, similar to cachedDimensionProps()
 */
export declare const cachedDimensionMethods: (Cstr: any, dimensionMethodNames: string[]) => void[];
