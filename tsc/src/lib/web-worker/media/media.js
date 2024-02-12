import '../../types';
import { defineCstr, defineCstrName, EMPTY_ARRAY, MediaSourceKey, ReadyStateKey, SourceBuffersKey, SourceBufferTasksKey, TimeRangesKey, } from './utils';
import { callMethod, getter, setter, constructGlobal, definePrototypePropertyDescriptor, randomId, InstanceIdKey, WinIdKey, } from './bridge';
export const initMedia = (WorkerBase, WorkerEventTargetProxy, env, win) => {
    var _a, _b;
    win.Audio = defineCstrName('HTMLAudioElement', class {
        constructor(src) {
            const audio = env.$createNode$('audio', randomId());
            audio.src = src;
            return audio;
        }
    });
    const WorkerAudioTrack = class extends WorkerBase {
        get enabled() {
            return getter(this, ['enabled']);
        }
        set enabled(value) {
            setter(this, ['enabled'], value);
        }
        get id() {
            return getter(this, ['id']);
        }
        get kind() {
            return getter(this, ['kind']);
        }
        get label() {
            return getter(this, ['label']);
        }
        get language() {
            return getter(this, ['language']);
        }
        get sourceBuffer() {
            return new WorkerSourceBuffer(this);
        }
    };
    const WorkerAudioTrackList = class {
        constructor(mediaElm) {
            const audioTracks = 'audioTracks';
            const winId = mediaElm[WinIdKey];
            const instanceId = mediaElm[InstanceIdKey];
            const instance = {
                addEventListener(...args) {
                    callMethod(mediaElm, [audioTracks, 'addEventListener'], args, 3 /* CallType.NonBlockingNoSideEffect */);
                },
                getTrackById(...args) {
                    return callMethod(mediaElm, [audioTracks, 'getTrackById'], args);
                },
                get length() {
                    return getter(mediaElm, [audioTracks, 'length']);
                },
                removeEventListener(...args) {
                    callMethod(mediaElm, [audioTracks, 'removeEventListener'], args, 3 /* CallType.NonBlockingNoSideEffect */);
                },
            };
            return new Proxy(instance, {
                get(target, propName) {
                    if (typeof propName === 'number') {
                        return new WorkerAudioTrack(winId, instanceId, [audioTracks, propName]);
                    }
                    return target[propName];
                },
            });
        }
    };
    const WorkerSourceBufferList = defineCstr(win, 'SourceBufferList', class extends Array {
        constructor(mediaSource) {
            super();
            this[MediaSourceKey] = mediaSource;
        }
        addEventListener(...args) {
            callMethod(this[MediaSourceKey], ['sourceBuffers', 'addEventListener'], args, 3 /* CallType.NonBlockingNoSideEffect */);
        }
        removeEventListener(...args) {
            callMethod(this[MediaSourceKey], ['sourceBuffers', 'removeEventListener'], args, 3 /* CallType.NonBlockingNoSideEffect */);
        }
    });
    const WorkerSourceBuffer = defineCstr(win, 'SourceBuffer', (_b = class extends WorkerEventTargetProxy {
            constructor(mediaSource) {
                super(mediaSource[WinIdKey], mediaSource[InstanceIdKey], ['sourceBuffers']);
                this[_a] = [];
                this[MediaSourceKey] = mediaSource;
            }
            abort() {
                const sbIndex = getSourceBufferIndex(this);
                callMethod(this, [sbIndex, 'appendWindowStart'], EMPTY_ARRAY, 1 /* CallType.Blocking */);
            }
            addEventListener(...args) {
                const sbIndex = getSourceBufferIndex(this);
                callMethod(this, [sbIndex, 'addEventListener'], args, 3 /* CallType.NonBlockingNoSideEffect */);
            }
            appendBuffer(buf) {
                this[SourceBufferTasksKey].push(['appendBuffer', [buf], buf]);
                drainSourceBufferQueue(this);
            }
            get appendWindowStart() {
                const sbIndex = getSourceBufferIndex(this);
                return getter(this, [sbIndex, 'appendWindowStart']);
            }
            set appendWindowStart(value) {
                const sbIndex = getSourceBufferIndex(this);
                setter(this, [sbIndex, 'appendWindowStart'], value);
            }
            get appendWindowEnd() {
                const sbIndex = getSourceBufferIndex(this);
                return getter(this, [sbIndex, 'appendWindowEnd']);
            }
            set appendWindowEnd(value) {
                const sbIndex = getSourceBufferIndex(this);
                setter(this, [sbIndex, 'appendWindowEnd'], value);
            }
            get buffered() {
                const mediaSource = this[MediaSourceKey];
                const sbIndex = getSourceBufferIndex(this);
                const timeRanges = new WorkerTimeRanges(mediaSource[WinIdKey], mediaSource[InstanceIdKey], [
                    'sourceBuffers',
                    sbIndex,
                    'buffered',
                ]);
                return timeRanges;
            }
            changeType(mimeType) {
                const sbIndex = getSourceBufferIndex(this);
                callMethod(this, [sbIndex, 'changeType'], [mimeType], 2 /* CallType.NonBlocking */);
            }
            get mode() {
                const sbIndex = getSourceBufferIndex(this);
                return getter(this, [sbIndex, 'mode']);
            }
            set mode(value) {
                const sbIndex = getSourceBufferIndex(this);
                setter(this, [sbIndex, 'mode'], value);
            }
            remove(start, end) {
                this[SourceBufferTasksKey].push(['remove', [start, end]]);
                drainSourceBufferQueue(this);
            }
            removeEventListener(...args) {
                const sbIndex = getSourceBufferIndex(this);
                callMethod(this, [sbIndex, 'removeEventListener'], args, 3 /* CallType.NonBlockingNoSideEffect */);
            }
            get timestampOffset() {
                const sbIndex = getSourceBufferIndex(this);
                return getter(this, [sbIndex, 'timestampOffset']);
            }
            set timestampOffset(value) {
                const sbIndex = getSourceBufferIndex(this);
                setter(this, [sbIndex, 'timestampOffset'], value);
            }
            get updating() {
                const sbIndex = getSourceBufferIndex(this);
                return getter(this, [sbIndex, 'updating']);
            }
        },
        _a = SourceBufferTasksKey,
        _b));
    const WorkerTimeRanges = defineCstr(win, 'TimeRanges', class extends WorkerBase {
        start(...args) {
            return callMethod(this, ['start'], args);
        }
        end(...args) {
            return callMethod(this, ['end'], args);
        }
        get length() {
            return getter(this, ['length']);
        }
    });
    const getSourceBufferIndex = (sourceBuffer) => {
        if (sourceBuffer) {
            const mediaSource = sourceBuffer[MediaSourceKey];
            const sourceBufferList = mediaSource[SourceBuffersKey];
            return sourceBufferList.indexOf(sourceBuffer);
        }
        return -1;
    };
    const drainSourceBufferQueue = (sourceBuffer) => {
        if (sourceBuffer[SourceBufferTasksKey].length) {
            if (!sourceBuffer.updating) {
                const task = sourceBuffer[SourceBufferTasksKey].shift();
                if (task) {
                    const sbIndex = getSourceBufferIndex(sourceBuffer);
                    callMethod(sourceBuffer, [sbIndex, task[0]], task[1], 3 /* CallType.NonBlockingNoSideEffect */, undefined, task[2]);
                }
            }
            setTimeout(() => drainSourceBufferQueue(sourceBuffer), 50);
        }
    };
    const HTMLMediaDescriptorMap = {
        buffered: {
            get() {
                if (!this[TimeRangesKey]) {
                    this[TimeRangesKey] = new WorkerTimeRanges(this[WinIdKey], this[InstanceIdKey], [
                        'buffered',
                    ]);
                    setTimeout(() => {
                        this[TimeRangesKey] = undefined;
                    }, 5000);
                }
                return this[TimeRangesKey];
            },
        },
        readyState: {
            get() {
                if (this[ReadyStateKey] === 4) {
                    return 4;
                }
                if (typeof this[ReadyStateKey] !== 'number') {
                    this[ReadyStateKey] = getter(this, ['readyState']);
                    setTimeout(() => {
                        this[ReadyStateKey] = undefined;
                    }, 1000);
                }
                return this[ReadyStateKey];
            },
        },
    };
    defineCstr(win, 'MediaSource', class extends WorkerEventTargetProxy {
        constructor() {
            super(env.$winId$);
            this[SourceBuffersKey] = new WorkerSourceBufferList(this);
            constructGlobal(this, 'MediaSource', EMPTY_ARRAY);
        }
        get activeSourceBuffers() {
            return [];
        }
        addSourceBuffer(mimeType) {
            const sourceBuffer = new WorkerSourceBuffer(this);
            this[SourceBuffersKey].push(sourceBuffer);
            callMethod(this, ['addSourceBuffer'], [mimeType]);
            return sourceBuffer;
        }
        clearLiveSeekableRange() {
            callMethod(this, ['clearLiveSeekableRange'], EMPTY_ARRAY, 2 /* CallType.NonBlocking */);
        }
        get duration() {
            return getter(this, ['duration']);
        }
        set duration(value) {
            setter(this, ['duration'], value);
        }
        endOfStream(endOfStreamError) {
            callMethod(this, ['endOfStream'], [endOfStreamError], 3 /* CallType.NonBlockingNoSideEffect */);
        }
        get readyState() {
            return getter(this, ['readyState']);
        }
        removeSourceBuffer(sourceBuffer) {
            const index = getSourceBufferIndex(sourceBuffer);
            if (index > -1) {
                this[SourceBuffersKey].splice(index, 1);
                callMethod(this, ['removeSourceBuffer'], [index], 1 /* CallType.Blocking */);
            }
        }
        setLiveSeekableRange(start, end) {
            callMethod(this, ['setLiveSeekableRange'], [start, end], 2 /* CallType.NonBlocking */);
        }
        get sourceBuffers() {
            return this[SourceBuffersKey];
        }
        static isTypeSupported(mimeType) {
            // https://developer.mozilla.org/en-US/docs/Web/API/MediaSource/isTypeSupported
            if (!isStaticTypeSupported.has(mimeType)) {
                const isSupported = callMethod(win, ['MediaSource', 'isTypeSupported'], [mimeType]);
                isStaticTypeSupported.set(mimeType, isSupported);
            }
            return isStaticTypeSupported.get(mimeType);
        }
    });
    // patch URL.createObjectURL() so that the main thread's MediaSource instance is used
    const winURL = (win.URL = defineCstrName('URL', class extends URL {
    }));
    const hasAudioTracks = 'audioTracks' in win.HTMLMediaElement.prototype;
    if (hasAudioTracks) {
        // not all browsers have audioTracks, only add if it's found
        defineCstr(win, 'AudioTrackList', WorkerAudioTrackList);
        defineCstr(win, 'AudioTrack', WorkerAudioTrack);
        HTMLMediaDescriptorMap.audioTracks = {
            get() {
                return new WorkerAudioTrackList(this);
            },
        };
    }
    definePrototypePropertyDescriptor(win.HTMLMediaElement, HTMLMediaDescriptorMap);
    winURL.createObjectURL = (obj) => callMethod(win, ['URL', 'createObjectURL'], [obj]);
    winURL.revokeObjectURL = (obj) => callMethod(win, ['URL', 'revokeObjectURL'], [obj]);
};
const isStaticTypeSupported = new Map();
