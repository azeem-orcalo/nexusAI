import { MongooseModule } from "@nestjs/mongoose";
import { loadEnv } from "./load-env";

loadEnv();

const mongoUri = process.env.MONGODB_URI?.trim() || "mongodb://127.0.0.1:27017/nexusai";

export const databaseImports = [MongooseModule.forRoot(mongoUri)];
