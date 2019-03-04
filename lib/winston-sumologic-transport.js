"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = __importDefault(require("request"));
var winston_transport_1 = __importDefault(require("winston-transport"));
var SumoLogic = /** @class */ (function (_super) {
    __extends(SumoLogic, _super);
    function SumoLogic(options) {
        var _this = _super.call(this) || this;
        if (!options) {
            options = {};
        }
        if (!options.url) {
            throw new Error('Need SumoLogic URL. See https://help.sumologic.com/Send-Data/Sources/02Sources-for-Hosted-Collectors/HTTP-Source/zGenerate-a-new-URL-for-an-HTTP-Source');
        }
        _this.name = 'SumoLogic';
        _this.url = options.url;
        _this.level = options.level || 'info';
        _this.silent = options.silent || false;
        _this.label = options.label || '';
        _this._timer = setInterval(function () {
            if (!_this._isSending) {
                _this._isSending = true;
                _this._promise = _this._sendLogs()
                    .then(function () { _this._isSending = false; })
                    .catch(function (e) { _this._isSending = false; throw e; });
            }
        }, options.interval || 1000);
        _this._waitingLogs = [];
        _this._isSending = false;
        _this._promise = Promise.resolve();
        return _this;
    }
    SumoLogic.prototype._request = function (content) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            request_1.default(_this.url, {
                body: content,
                method: 'POST'
            }, function (err, response) {
                if (!!err || response.statusCode !== 200) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    };
    SumoLogic.prototype._sendLogs = function () {
        var _this = this;
        try {
            if (this._waitingLogs.length === 0) {
                return Promise.resolve(undefined);
            }
            var numBeingSent_1 = this._waitingLogs.length;
            var content = '';
            for (var i = 0; i < numBeingSent_1; i++) {
                content += JSON.stringify(this._waitingLogs[i]) + '\n';
            }
            return this._request(content)
                .then(function () {
                _this._waitingLogs.splice(0, numBeingSent_1);
            });
        }
        catch (e) {
            return Promise.reject(e);
        }
    };
    SumoLogic.prototype.log = function (info, callback) {
        try {
            var level = info.level, message = info.message, meta = __rest(info, ["level", "message"]);
            if (this.silent) {
                callback();
                return;
            }
            if (typeof meta === 'function') {
                callback = meta;
                meta = {};
            }
            if (this.label) {
                message = "[" + this.label + "] " + message;
            }
            var content = {
                level: level,
                message: message,
                meta: meta
            };
            this._waitingLogs.push(content);
            callback();
        }
        catch (e) {
            callback(e);
        }
    };
    return SumoLogic;
}(winston_transport_1.default));
exports.SumoLogic = SumoLogic;
//# sourceMappingURL=winston-sumologic-transport.js.map