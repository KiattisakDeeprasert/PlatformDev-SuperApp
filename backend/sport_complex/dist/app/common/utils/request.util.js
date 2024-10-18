"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformFile = transformFile;
function transformFile(file, dto, target) {
    if (file) {
        dto[target] = file?.filename;
        return dto;
    }
    if (typeof dto[target] !== 'string')
        return dto;
    if (!dto[target]) {
        dto[target] = null;
        return dto;
    }
    delete dto[target];
    return dto;
}
//# sourceMappingURL=request.util.js.map