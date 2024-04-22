import { InitializeScriptData, InstanceId, ResolveUrlType, WebWorkerEnvironment, WinId, WorkerInstance } from '../types';
export declare const initNextScriptsInWebWorker: (initScript: InitializeScriptData) => Promise<void>;
export declare const runScriptContent: (env: WebWorkerEnvironment, instanceId: InstanceId, scriptContent: string, winId: WinId, errorMsg: string) => string;
/**
 * Replace some `this` symbols with a new value.
 * Still not perfect, but might be better than a less advanced regex
 * Check out the tests for examples: tests/unit/worker-exec.spec.ts
 *
 * This still fails with simple strings like:
 * 'sadly we fail at this simple string'
 *
 * One way to do that would be to remove all comments from code and do single / double quote counting
 * per symbol. But this will still fail with evals.
 */
export declare const replaceThisInSource: (scriptContent: string, newThis: string) => string;
export declare const run: (env: WebWorkerEnvironment, scriptContent: string, scriptUrl?: string) => void;
export declare const insertIframe: (winId: WinId, iframe: WorkerInstance) => void;
export declare const resolveToUrl: (env: WebWorkerEnvironment, url: string, type: ResolveUrlType | null, baseLocation?: Location, resolvedUrl?: URL, configResolvedUrl?: any) => any;
export declare const resolveUrl: (env: WebWorkerEnvironment, url: string, type: ResolveUrlType | null) => string;
export declare const resolveSendBeaconRequestParameters: (env: WebWorkerEnvironment, url: string) => import("../types").SendBeaconParameters;
export declare const getPartytownScript: () => string;
