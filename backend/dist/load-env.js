"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnv = loadEnv;
const fs_1 = require("fs");
const path_1 = require("path");
let envLoaded = false;
function loadEnv() {
    if (envLoaded) {
        return;
    }
    const envPath = (0, path_1.resolve)(__dirname, "..", ".env");
    if (!(0, fs_1.existsSync)(envPath)) {
        envLoaded = true;
        return;
    }
    const contents = (0, fs_1.readFileSync)(envPath, "utf8");
    for (const rawLine of contents.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith("#")) {
            continue;
        }
        const separatorIndex = line.indexOf("=");
        if (separatorIndex < 1) {
            continue;
        }
        const key = line.slice(0, separatorIndex).trim();
        if (!key || process.env[key] !== undefined) {
            continue;
        }
        let value = line.slice(separatorIndex + 1).trim();
        if ((value.startsWith("\"") && value.endsWith("\"")) ||
            (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        process.env[key] = value;
    }
    envLoaded = true;
}
//# sourceMappingURL=load-env.js.map