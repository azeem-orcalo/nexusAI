"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseImports = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const load_env_1 = require("./load-env");
(0, load_env_1.loadEnv)();
const mongoUri = process.env.MONGODB_URI?.trim() || "mongodb://127.0.0.1:27017/nexusai";
exports.databaseImports = [mongoose_1.MongooseModule.forRoot(mongoUri)];
//# sourceMappingURL=database.config.js.map