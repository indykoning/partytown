import type { EventHandler, WebWorkerEnvironment } from '../types';
type HTMLImageElementEvents = 'load' | 'error';
export declare const createImageConstructor: (env: WebWorkerEnvironment) => {
    new (): {
        s: string;
        l: EventHandler[];
        e: EventHandler[];
        style: Record<string, string>;
        src: string;
        addEventListener(eventName: HTMLImageElementEvents, cb: EventHandler): void;
        removeEventListener(eventName: HTMLImageElementEvents, cb: EventHandler): void;
        onload: EventHandler;
        onerror: EventHandler;
    };
};
export {};
