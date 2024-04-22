import { InstanceId, MainWindowContext, WinId } from '../types';
export declare const getAndSetInstanceId: (instance: any, instanceId?: InstanceId) => string | undefined;
export declare const getInstance: <T = any>(winId: WinId, instanceId: InstanceId, win?: MainWindowContext, doc?: Document, docId?: string) => T | undefined;
export declare const setInstanceId: (instance: any, instanceId: InstanceId, now?: number) => void;
