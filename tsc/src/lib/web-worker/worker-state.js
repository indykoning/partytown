import { InstanceStateKey, webWorkerRefIdsByRef, webWorkerRefsByRefId } from './worker-constants';
import { randomId } from '../utils';
export const hasInstanceStateValue = (instance, stateKey) => stateKey in instance[InstanceStateKey];
export const getInstanceStateValue = (instance, stateKey) => instance[InstanceStateKey][stateKey];
export const setInstanceStateValue = (instance, stateKey, stateValue) => (instance[InstanceStateKey][stateKey] = stateValue);
export const setWorkerRef = (ref, refId) => {
    if (!(refId = webWorkerRefIdsByRef.get(ref))) {
        webWorkerRefIdsByRef.set(ref, (refId = randomId()));
        webWorkerRefsByRefId[refId] = ref;
    }
    return refId;
};
