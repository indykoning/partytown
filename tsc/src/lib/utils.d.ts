import type { ApplyPath, RandomId } from './types';
export declare const debug: boolean;
export declare const isPromise: (v: any) => v is Promise<unknown>;
export declare const noop: () => void;
export declare const len: (obj: {
    length: number;
}) => number;
export declare const getConstructorName: (obj: Object) => string;
export declare const startsWith: (str: string, val: string) => boolean;
export declare const isValidMemberName: (memberName: string) => boolean;
export declare const getLastMemberName: (applyPath: ApplyPath, i?: number | undefined) => string;
export declare const getNodeName: (node: Node) => string;
export declare const EMPTY_ARRAY: never[];
export declare const randomId: RandomId;
/**
 * The `type` attribute for Partytown scripts, which does two things:
 *
 * 1. Prevents the `<script>` from executing on the main thread.
 * 2. Is used as a selector so the Partytown library can find all scripts to execute in a web worker.
 *
 * @public
 */
export declare const SCRIPT_TYPE = "text/partytown";
export declare const SCRIPT_TYPE_EXEC = "-x";
export declare const defineProperty: (obj: any, memberName: string, descriptor: PropertyDescriptor) => any;
export declare const defineConstructorName: (Cstr: any, value: string) => any;
export declare const definePrototypeProperty: (Cstr: any, memberName: string, descriptor: PropertyDescriptor) => any;
export declare const definePrototypePropertyDescriptor: (Cstr: any, propertyDescriptorMap: any) => any;
export declare const definePrototypeValue: (Cstr: any, memberName: string, value: any) => any;
export declare const createElementFromConstructor: (doc: Document, interfaceName: string, r?: RegExpMatchArray | null | undefined, tag?: string | undefined) => HTMLElement | SVGElement | undefined;
export declare const isValidUrl: (url: any) => boolean;
