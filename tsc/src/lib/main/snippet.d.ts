import type { MainWindow, PartytownConfig } from '../types';
export declare function snippet(win: MainWindow, doc: Document, nav: Navigator, top: Window, useAtomics: boolean, config?: PartytownConfig, libPath?: string, timeout?: any, scripts?: NodeListOf<HTMLScriptElement>, sandbox?: HTMLIFrameElement | HTMLScriptElement, mainForwardFn?: typeof win, isReady?: number): void;
