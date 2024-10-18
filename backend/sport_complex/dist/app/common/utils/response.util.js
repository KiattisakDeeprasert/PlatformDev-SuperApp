"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageBuilder = exports.ResponseMethod = void 0;
exports.createResponse = createResponse;
const builder_1 = require("../lib/builder");
function createResponse(statusCode, message, data) {
    return {
        statusCode,
        message,
        data,
    };
}
var ResponseMethod;
(function (ResponseMethod) {
    ResponseMethod["findOne"] = "findOne";
    ResponseMethod["findAll"] = "findAll";
    ResponseMethod["create"] = "create";
    ResponseMethod["update"] = "update";
    ResponseMethod["remove"] = "remove";
})(ResponseMethod || (exports.ResponseMethod = ResponseMethod = {}));
class MessageBuilder extends builder_1.Builder {
    build(method, options) {
        switch (method) {
            case ResponseMethod.findOne:
                return `Get ${this.getName()} by id ${options.id} successfully`;
            case ResponseMethod.findAll:
                return `Get ${this.getName({ purals: true })} successfully`;
            case ResponseMethod.create:
                return `${this.getName({ purals: true, upper: true })} created successfully`;
            case ResponseMethod.update:
                return `Updated ${this.getName()} by id ${options.id} successfully`;
            case ResponseMethod.remove:
                return `Deleted ${this.getName()} by id ${options.id} successfully`;
            default:
                throw new Error('Invalid error method');
        }
    }
}
exports.MessageBuilder = MessageBuilder;
//# sourceMappingURL=response.util.js.map