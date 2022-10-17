import { MainWindowContext, MessageFromWorkerToSandbox, PartytownWebWorker } from '../types';
export declare const onMessageFromWebWorker: (worker: PartytownWebWorker, msg: MessageFromWorkerToSandbox, winCtx?: MainWindowContext | undefined) => void;
