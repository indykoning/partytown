import { StorageItem, WebWorkerEnvironment } from '../types';
export declare const addStorageApi: (win: any, storageName: 'localStorage' | 'sessionStorage', storages: Map<string, StorageItem[]>, isSameOrigin: boolean, env: WebWorkerEnvironment) => void;
