import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AccountService } from "./account.service";
import { CreateApiKeyDto } from "./dto/create-api-key.dto";
import { UpdateSettingsDto } from "./dto/update-settings.dto";

@ApiTags("account")
@Controller("account")
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get("settings")
  @ApiOperation({ summary: "Get account and personalization settings" })
  settings() {
    return this.accountService.getSettings();
  }

  @Patch("settings")
  @ApiOperation({ summary: "Update language and personalization settings" })
  updateSettings(@Body() payload: UpdateSettingsDto) {
    return this.accountService.updateSettings(payload);
  }

  @Get("api-keys")
  @ApiOperation({ summary: "List API keys" })
  apiKeys() {
    return this.accountService.getApiKeys();
  }

  @Post("api-keys")
  @ApiOperation({ summary: "Create a new API key" })
  createApiKey(@Body() payload: CreateApiKeyDto) {
    return this.accountService.createApiKey(payload);
  }

  @Delete("api-keys/:id")
  @ApiOperation({ summary: "Delete an API key" })
  removeApiKey(@Param("id") id: string) {
    return this.accountService.removeApiKey(id);
  }
}
