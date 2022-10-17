import { WebWorkerEnvironment } from '../types';
export declare const patchDocument: (WorkerDocument: any, env: WebWorkerEnvironment, isDocumentImplementation?: boolean | undefined) => void;
export declare const patchDocumentElementChild: (WokerDocumentElementChild: any, env: WebWorkerEnvironment) => void;
export declare const patchHTMLHtmlElement: (WorkerHTMLHtmlElement: any, env: WebWorkerEnvironment) => void;
export declare const patchDocumentFragment: (WorkerDocumentFragment: any) => void;
