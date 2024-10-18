"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObjectValue = getObjectValue;
exports.assignObjectValue = assignObjectValue;
exports.flattenObject = flattenObject;
class PathNotFoundError extends Error {
    constructor(path) {
        super(`Path not found: ${path}`);
        this.name = 'PathNotFoundError';
    }
}
function getObjectValue(obj, path, throwError = false) {
    const parts = path.split('.');
    let current = obj;
    for (const part of parts) {
        if (current && typeof current === 'object' && part in current) {
            current = current[part];
        }
        else {
            if (throwError) {
                throw new PathNotFoundError(path);
            }
            return undefined;
        }
    }
    return current;
}
function assignObjectValue(obj, path, value, throwError = false) {
    const parts = path.split('.');
    let current = obj;
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i === parts.length - 1) {
            current[part] = value;
        }
        else {
            if (current && typeof current === 'object' && part in current) {
                current = current[part];
            }
            else {
                if (throwError) {
                    throw new PathNotFoundError(path);
                }
                return;
            }
        }
    }
    return current;
}
function flattenObject(obj, parentKey = '') {
    return Object.keys(obj).reduce((acc, key) => {
        const value = obj[key];
        const nestedKey = parentKey ? `${parentKey}.${key}` : key;
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            Object.assign(acc, flattenObject(value, nestedKey));
        }
        else {
            acc[nestedKey] = value;
        }
        return acc;
    }, {});
}
//# sourceMappingURL=object.util.js.map