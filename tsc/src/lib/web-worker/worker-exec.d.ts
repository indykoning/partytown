import { InitializeScriptData, InstanceId, ResolveUrlType, WebWorkerEnvironment, WinId, WorkerInstance } from '../types';
export declare const initNextScriptsInWebWorker: (initScript: InitializeScriptData) => Promise<void>;
export declare const runScriptContent: (env: WebWorkerEnvironment, instanceId: InstanceId, scriptContent: string, winId: WinId, errorMsg: string) => string;
export declare const run: (env: WebWorkerEnvironment, scriptContent: string, scriptUrl?: string | undefined) => void;
export declare const insertIframe: (winId: WinId, iframe: WorkerInstance) => void;
export declare const resolveToUrl: (env: WebWorkerEnvironment, url: string, type: ResolveUrlType | null, baseLocation?: Location | undefined, resolvedUrl?: URL | undefined, configResolvedUrl?: any) => any;
export declare const resolveUrl: (env: WebWorkerEnvironment, url: string, type: ResolveUrlType | null) => string;
export declare const getPartytownScript: () => string;
