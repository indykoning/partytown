import { InstanceId, MainWindowContext, WinId } from '../types';
export declare const getAndSetInstanceId: (instance: any, instanceId?: string | undefined) => string | undefined;
export declare const getInstance: <T = any>(winId: WinId, instanceId: InstanceId, win?: MainWindowContext | undefined, doc?: Document | undefined, docId?: string | undefined) => T | undefined;
export declare const setInstanceId: (instance: any, instanceId: InstanceId, now?: number | undefined) => void;
