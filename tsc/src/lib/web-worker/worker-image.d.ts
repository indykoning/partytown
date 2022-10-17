import type { EventHandler, WebWorkerEnvironment } from '../types';
export declare const createImageConstructor: (env: WebWorkerEnvironment) => {
    new (): {
        s: string;
        l: EventHandler[];
        e: EventHandler[];
        style: Record<string, string>;
        src: string;
        addEventListener(eventName: 'load' | 'error', cb: EventHandler): void;
        onload: EventHandler;
        onerror: EventHandler;
    };
};
