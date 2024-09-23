"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageConfig = void 0;
const multer_1 = require("multer");
const path_1 = require("path");
exports.storageConfig = (0, multer_1.diskStorage)({
    destination: './uploads',
    filename: (req, file, cb) => {
        const extension = (0, path_1.extname)(file.originalname);
        const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
        cb(null, `${randomName}${extension}`);
    },
});
//# sourceMappingURL=storage.config.js.map