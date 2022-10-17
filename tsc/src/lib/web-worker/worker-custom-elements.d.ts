import type { InstanceId, WinId, WorkerMessageType, WorkerNodeConstructors } from '../types';
export declare const createCustomElementRegistry: (win: any, nodeCstrs: WorkerNodeConstructors) => void;
export declare const callCustomElementCallback: (_type: WorkerMessageType.CustomElementCallback, winId: WinId, instanceId: InstanceId, callbackName: string, args: any[]) => void;
