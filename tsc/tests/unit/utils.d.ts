import type { MainWindow, PartytownInternalConfig, PartytownWebWorker, WebWorkerEnvironment, WinId } from '../../src/lib/types';
export declare const suite: (title?: string) => import("uvu").uvu.Test<TestContext>;
export interface TestContext {
    winId: WinId;
    /**
     * Same as "win", but IS typed
     */
    window: MainWindow;
    /**
     * Same as "window", but NOT typed
     */
    win: any;
    top: any;
    /**
     * Same as "doc", but IS typed
     */
    document: Document;
    /**
     * Same as "document", but NOT typed
     */
    doc: any;
    /**
     * Same as "nav", but NOT typed
     */
    navigator: TestNavigator;
    /**
     * Same as "navigator", but NOT typed
     */
    nav: any;
    location: Location;
    loc: any;
    worker: TestWorker;
    config: PartytownInternalConfig;
    env: WebWorkerEnvironment;
    snippetCode: string;
    run: (code: string) => any;
}
export interface TestWorker extends PartytownWebWorker {
    $messages: any[];
}
export interface TestNavigator extends Navigator {
    $serviceWorkerUrl?: string;
    $serviceWorkerOptions?: any;
}
