export const ContextKey = Symbol();
export const MediaSourceKey = Symbol();
export const ReadyStateKey = Symbol();
export const SourceBuffersKey = Symbol();
export const SourceBufferTasksKey = Symbol();
export const TimeRangesKey = Symbol();
export const EMPTY_ARRAY = [];
export const defineCstr = (win, cstrName, Cstr) => (win[cstrName] = defineCstrName(cstrName, Cstr));
export const defineCstrName = (cstrName, Cstr) => Object.defineProperty(Cstr, 'name', {
    value: cstrName,
});
export const notImpl = (api) => console.warn(`${api} not implemented`);
