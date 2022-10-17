import { Plugin } from 'rollup';
import { BuildOptions, MessageType } from './utils';
export declare function buildWebWorker(opts: BuildOptions, msgType: MessageType, debug: boolean): Promise<string>;
export declare function webWorkerBlobUrlPlugin(opts: BuildOptions, msgType: MessageType, debug: boolean): Plugin;
