import { PartytownWebWorker, SerializedTransfer, SerializedType, WinId } from '../types';
export declare const serializeForWorker: ($winId$: WinId, value: any, added?: Set<any>, type?: string, cstrName?: string, prevInstanceId?: string) => SerializedTransfer | undefined;
export declare const deserializeFromWorker: (worker: PartytownWebWorker, serializedTransfer: SerializedTransfer | undefined, serializedType?: SerializedType, serializedValue?: any) => any;
