import { MainAccessRequest, MainAccessResponse, PartytownWebWorker } from '../types';
export declare const mainAccessHandler: (worker: PartytownWebWorker, accessReq: MainAccessRequest) => Promise<MainAccessResponse>;
