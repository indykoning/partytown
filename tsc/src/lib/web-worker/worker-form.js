import { definePrototypePropertyDescriptor } from '../utils';
import { cachedProps } from './worker-constructors';
export const patchHTMLFormElement = (WorkerHTMLFormElement) => {
    const HTMLFormDescriptorMap = {};
    definePrototypePropertyDescriptor(WorkerHTMLFormElement, HTMLFormDescriptorMap);
    cachedProps(WorkerHTMLFormElement, 'elements');
};
