import { onFetchServiceWorkerRequest, receiveMessageFromSandboxToServiceWorker } from './fetch';
self.oninstall = () => self.skipWaiting();
self.onactivate = () => self.clients.claim();
self.onmessage = receiveMessageFromSandboxToServiceWorker;
self.onfetch = onFetchServiceWorkerRequest;
