import { defineConstructorName } from '../utils';
export const createPerformanceConstructor = (win, WorkerBase, cstrName) => {
    win[cstrName] = defineConstructorName(class extends WorkerBase {
        now() {
            // use the web worker's performance.now()
            // no need to go to main for this
            return performance.now();
        }
    }, cstrName);
};
