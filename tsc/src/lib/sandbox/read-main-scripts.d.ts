import { InstanceId, MainWindowContext, PartytownWebWorker } from '../types';
export declare const readNextScript: (worker: PartytownWebWorker, winCtx: MainWindowContext) => void;
export declare const initializedWorkerScript: (worker: PartytownWebWorker, winCtx: MainWindowContext, instanceId: InstanceId, errorMsg: string, scriptElm?: HTMLScriptElement | null) => void;
