import { createWindow } from 'domino';
import { readFileSync } from 'fs';
import { join } from 'path';
import { suite as uvuSuite } from 'uvu';
import { randomId } from '../../src/lib/utils';
import { environments, webWorkerCtx } from '../../src/lib/web-worker/worker-constants';
export const suite = (title) => {
    const s = uvuSuite(title);
    if (_partytownSnippet == null) {
        const snippetPath = join(__dirname, '..', '..', 'lib', 'partytown.js');
        _partytownSnippet = readFileSync(snippetPath, 'utf-8');
    }
    s.before.each((ctx) => {
        ctx.winId = randomId();
        ctx.win = ctx.window = getWindow();
        ctx.top = ctx.win;
        ctx.doc = ctx.document = ctx.window.document;
        ctx.nav = ctx.navigator = getNavigator();
        ctx.loc = ctx.location = ctx.window.location;
        ctx.worker = getWorker();
        webWorkerCtx.$config$ = ctx.config = {};
        ctx.env = createWorkerWindownEnvironment(ctx);
        ctx.snippetCode = _partytownSnippet;
        ctx.doc.addEventListener = (_, cb) => cb();
        ctx.run = (code) => {
            const fn = new Function('window', 'top', 'document', 'navigator', code);
            return fn(ctx.win, ctx.top, ctx.doc, ctx.nav);
        };
    });
    return s;
};
let _partytownSnippet = null;
function getWindow() {
    const win = createWindow();
    win.top = win.self = win.parent = win.window = win;
    win.document.readyState = 'complete';
    return win;
}
function getNavigator() {
    const nav = {};
    nav.serviceWorker = {
        register(scriptUrl, opts) {
            nav.$serviceWorkerUrl = scriptUrl;
            nav.$serviceWorkerOptions = opts;
            return {
                then(cb) {
                    cb({ active: true });
                },
            };
        },
    };
    return nav;
}
function getWorker() {
    const $messages = [];
    return {
        postMessage(...args) {
            $messages.push(args);
        },
        $messages,
    };
}
function createWorkerWindownEnvironment(ctx) {
    for (const winId in environments) {
        delete environments[winId];
    }
    environments[ctx.winId] = {
        $winId$: ctx.winId,
        $parentWinId$: ctx.winId,
        $window$: ctx.window,
        $document$: ctx.document,
        $documentElement$: ctx.document.documentElement,
        $head$: ctx.document.head,
        $body$: ctx.document.body,
        $location$: ctx.window.location,
        $visibilityState$: 'visible',
        $createNode$: () => null,
        $isSameOrigin$: true,
    };
    return environments[ctx.winId];
}
