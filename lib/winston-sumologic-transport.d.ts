import TransportStream from 'winston-transport';
export interface SumoLogicTransportOptions {
    url?: string;
    level?: string;
    silent?: boolean;
    interval?: number;
    label?: string;
}
export interface SumoLogicLogEntry {
    level: string;
    message: string;
    meta: any;
}
export declare class SumoLogic extends TransportStream {
    name: string;
    url: string;
    label: string;
    _timer: any;
    _waitingLogs: Array<SumoLogicLogEntry>;
    _isSending: boolean;
    _promise: Promise<void>;
    constructor(options?: SumoLogicTransportOptions);
    _request(content: string): Promise<{}>;
    _sendLogs(): Promise<void>;
    log(info: any, callback: Function): void;
}
