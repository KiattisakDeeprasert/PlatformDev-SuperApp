"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorBuilder = exports.RequestAction = exports.ErrorMethod = void 0;
const builder_1 = require("../lib/builder");
var ErrorMethod;
(function (ErrorMethod) {
    ErrorMethod["duplicated"] = "duplicated";
    ErrorMethod["notFound"] = "notFound";
})(ErrorMethod || (exports.ErrorMethod = ErrorMethod = {}));
var RequestAction;
(function (RequestAction) {
    RequestAction["create"] = "creating";
    RequestAction["update"] = "updating";
})(RequestAction || (exports.RequestAction = RequestAction = {}));
class ErrorBuilder extends builder_1.Builder {
    build(method, options) {
        switch (method) {
            case ErrorMethod.duplicated:
                return `Data is duplicated while ${options.action} ${this.getName()}`;
            case ErrorMethod.notFound:
                return `Cannot found ${this.getName()} id ${options.id}`;
            default:
                throw new Error('Invalid error method');
        }
    }
}
exports.ErrorBuilder = ErrorBuilder;
//# sourceMappingURL=error.util.js.map