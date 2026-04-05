import { MongooseModule } from "@nestjs/mongoose";
import { loadEnv } from "./load-env";

loadEnv();

const mongoUri = process.env.MONGODB_URI?.trim();

export const databaseImports = mongoUri ? [MongooseModule.forRoot(mongoUri)] : [];
