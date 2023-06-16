import { PartytownWebWorker, SerializedTransfer, SerializedType, WinId } from '../types';
export declare const serializeForWorker: ($winId$: WinId, value: any, added?: Set<any> | undefined, type?: string | undefined, cstrName?: string | undefined, prevInstanceId?: string | undefined) => SerializedTransfer | undefined;
export declare const deserializeFromWorker: (worker: PartytownWebWorker, serializedTransfer: SerializedTransfer | undefined, serializedType?: SerializedType | undefined, serializedValue?: any) => any;
