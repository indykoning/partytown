import { ApplyPath, InstanceId, RefHandlerCallbackData, SerializedInstance, SerializedTransfer, SerializedType, WinId, WorkerNode } from '../types';
export declare const serializeForMain: ($winId$: WinId, $instanceId$: InstanceId, value: any, added?: Set<any> | undefined, type?: string | undefined) => SerializedTransfer | undefined;
export declare const serializeInstanceForMain: (instance: any, value: any) => SerializedTransfer | undefined;
export declare const deserializeFromMain: (winId: WinId | undefined | null, instanceId: InstanceId | undefined | null, applyPath: ApplyPath, serializedValueTransfer?: SerializedTransfer | undefined, serializedType?: SerializedType | undefined, serializedValue?: any, obj?: any, key?: string | undefined) => any;
export declare const getOrCreateSerializedInstance: ([winId, instanceId, nodeName, prevInstanceId]: SerializedInstance) => any;
export declare const callWorkerRefHandler: ({ $winId$, $instanceId$, $refId$, $thisArg$, $args$, }: RefHandlerCallbackData) => void;
export declare class NodeList {
    private _;
    constructor(nodes: WorkerNode[]);
    entries(): IterableIterator<[number, WorkerNode]>;
    forEach(cb: (value: Node, index: number) => void, thisArg?: any): void;
    item(index: number): any;
    keys(): IterableIterator<number>;
    get length(): number;
    values(): IterableIterator<WorkerNode>;
    [Symbol.iterator](): IterableIterator<WorkerNode>;
}
export declare const createNodeListCstr: (win: any) => void;
