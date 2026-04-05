import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AccountController } from "./account.controller";
import { AccountService } from "./account.service";
import { ApiKey, ApiKeySchema } from "./schemas/api-key.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: ApiKey.name, schema: ApiKeySchema }])],
  controllers: [AccountController],
  providers: [AccountService]
})
export class AccountModule {}
