import { debug } from '../utils';
import Sandbox from '@sandbox';
import SandboxDebug from '@sandbox-debug';
export const onFetchServiceWorkerRequest = (ev) => {
    const req = ev.request;
    const url = new URL(req.url);
    const pathname = url.pathname;
    if (debug && pathname.endsWith('sw.html')) {
        // debug version (sandbox and web worker are not inlined)
        ev.respondWith(response(SandboxDebug));
    }
    else if (!debug && pathname.endsWith('sw.html')) {
        // sandbox and webworker, minified and inlined
        ev.respondWith(response(Sandbox));
    }
    else if (pathname.endsWith('proxytown')) {
        // proxy request
        ev.respondWith(httpRequestFromWebWorker(req));
    }
};
const resolves = new Map();
export const receiveMessageFromSandboxToServiceWorker = (ev) => {
    const accessRsp = ev.data;
    const r = resolves.get(accessRsp.$msgId$);
    if (r) {
        resolves.delete(accessRsp.$msgId$);
        clearTimeout(r[1]);
        r[0](accessRsp);
    }
};
const sendMessageToSandboxFromServiceWorker = (accessReq) => new Promise(async (resolve) => {
    const clients = await self.clients.matchAll();
    const client = [...clients].sort((a, b) => {
        if (a.url > b.url)
            return -1;
        if (a.url < b.url)
            return 1;
        return 0;
    })[0];
    if (client) {
        const timeout = debug ? 120000 : 10000;
        const msgResolve = [
            resolve,
            setTimeout(() => {
                resolves.delete(accessReq.$msgId$);
                resolve(swMessageError(accessReq, `Timeout`));
            }, timeout),
        ];
        resolves.set(accessReq.$msgId$, msgResolve);
        client.postMessage(accessReq);
    }
    else {
        resolve(swMessageError(accessReq, `NoParty`));
    }
});
const swMessageError = (accessReq, $error$) => ({
    $msgId$: accessReq.$msgId$,
    $error$,
});
const httpRequestFromWebWorker = (req) => new Promise(async (resolve) => {
    const accessReq = await req.clone().json();
    const responseData = await sendMessageToSandboxFromServiceWorker(accessReq);
    resolve(response(JSON.stringify(responseData), 'application/json'));
});
const response = (body, contentType) => new Response(body, {
    headers: {
        'content-type': contentType || 'text/html',
        'Cache-Control': 'no-store',
    },
});
