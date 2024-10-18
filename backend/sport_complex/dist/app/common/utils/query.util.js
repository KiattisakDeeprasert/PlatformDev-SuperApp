"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractQury = extractQury;
function extractQury(query) {
    const queries = Array.isArray(query) ? query : [query];
    return Object.fromEntries(queries.map((v) => [v, true]));
}
//# sourceMappingURL=query.util.js.map