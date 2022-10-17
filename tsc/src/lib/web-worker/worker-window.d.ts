import { WebWorkerEnvironment, WinId } from '../types';
export declare const createWindow: ($winId$: WinId, $parentWinId$: WinId, url: string, $visibilityState$?: string | undefined, isIframeWindow?: boolean | undefined, isDocumentImplementation?: boolean | undefined) => WebWorkerEnvironment;
