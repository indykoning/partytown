import type { MainWindow, MainWindowContext, WinId } from '../types';
export declare const InstanceIdKey: unique symbol;
export declare const CreatedKey: unique symbol;
export declare const instances: Map<string, any>;
export declare const mainRefs: Map<string, Function>;
export declare const winCtxs: {
    [winId: WinId]: MainWindowContext | undefined;
};
export declare const windowIds: WeakMap<MainWindow, string>;
