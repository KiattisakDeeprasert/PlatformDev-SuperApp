"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    upload: {
        baseUrl: process.env.UPLOAD_BASE_URL || "http://127.0.0.1:8081/uploads",
        apiPath: process.env.UPLOAD_API_PATH || "/uploads",
    },
    port: parseInt(process.env.PORT, 10) || 8081,
    database: process.env.MONGO_URI || 'mongodb+srv://admin:user1234@cluster0.35bsc.mongodb.net/sport_complex-db',
});
//# sourceMappingURL=configuration.js.map