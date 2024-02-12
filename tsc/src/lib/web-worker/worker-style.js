import { cachedDimensions } from './worker-constants';
import { callMethod, getter } from './worker-proxy';
import '../types';
import { defineConstructorName, definePrototypePropertyDescriptor } from '../utils';
import { getInstanceStateValue, setInstanceStateValue } from './worker-state';
import { logDimensionCacheClearMethod } from '../log';
export const createCSSStyleSheetConstructor = (win, cssStyleSheetCstrName) => {
    win[cssStyleSheetCstrName] = defineConstructorName(class {
        constructor(ownerNode) {
            this.ownerNode = ownerNode;
        }
        get cssRules() {
            const ownerNode = this.ownerNode;
            return new Proxy({}, {
                get(target, propKey) {
                    const propName = String(propKey);
                    if (propName === 'item') {
                        return (index) => getCssRule(ownerNode, index);
                    }
                    if (propName === 'length') {
                        return getCssRules(ownerNode).length;
                    }
                    if (!isNaN(propName)) {
                        return getCssRule(ownerNode, propName);
                    }
                    return target[propKey];
                },
            });
        }
        insertRule(ruleText, index) {
            const cssRules = getCssRules(this.ownerNode);
            index = index === undefined ? 0 : index;
            if (index >= 0 && index <= cssRules.length) {
                callMethod(this.ownerNode, ['sheet', 'insertRule'], [ruleText, index], 2 /* CallType.NonBlocking */);
                // insert bogus data so the array/length is correct
                // but later on, if we ever want to "read" this inserted rule
                // we do a real lookup to get the dom correct data
                cssRules.splice(index, 0, 0);
            }
            logDimensionCacheClearMethod(this.ownerNode, 'insertRule');
            cachedDimensions.clear();
            return index;
        }
        deleteRule(index) {
            callMethod(this.ownerNode, ['sheet', 'deleteRule'], [index], 2 /* CallType.NonBlocking */);
            getCssRules(this.ownerNode).splice(index, 1);
            logDimensionCacheClearMethod(this.ownerNode, 'deleteRule');
            cachedDimensions.clear();
        }
        get type() {
            return 'text/css';
        }
    }, cssStyleSheetCstrName);
    const HTMLStyleDescriptorMap = {
        sheet: {
            get() {
                return new win[cssStyleSheetCstrName](this);
            },
        },
    };
    definePrototypePropertyDescriptor(win.HTMLStyleElement, HTMLStyleDescriptorMap);
};
const getCssRules = (ownerNode, cssRules) => {
    cssRules = getInstanceStateValue(ownerNode, 2 /* StateProp.cssRules */);
    if (!cssRules) {
        cssRules = getter(ownerNode, ['sheet', 'cssRules']);
        setInstanceStateValue(ownerNode, 2 /* StateProp.cssRules */, cssRules);
    }
    return cssRules;
};
const getCssRule = (ownerNode, index, cssRules) => {
    cssRules = getCssRules(ownerNode);
    if (cssRules[index] === 0) {
        cssRules[index] = getter(ownerNode, ['sheet', 'cssRules', parseInt(index, 10)]);
    }
    return cssRules[index];
};
