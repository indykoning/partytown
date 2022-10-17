import type { RefHandler, WorkerInstance } from '../types';
export declare const hasInstanceStateValue: (instance: WorkerInstance, stateKey: string | number) => boolean;
export declare const getInstanceStateValue: <T = any>(instance: WorkerInstance, stateKey: string | number) => T;
export declare const setInstanceStateValue: (instance: WorkerInstance, stateKey: string | number, stateValue: any) => any;
export declare const setWorkerRef: (ref: RefHandler, refId?: string | undefined) => string;
