import { Injectable } from "@nestjs/common";
import { CreateApiKeyDto } from "./dto/create-api-key.dto";
import { UpdateSettingsDto } from "./dto/update-settings.dto";

@Injectable()
export class AccountService {
  getSettings() {
    return {
      language: "en",
      persona: "builder"
    };
  }

  updateSettings(payload: UpdateSettingsDto) {
    return {
      language: payload.language ?? "en",
      persona: payload.persona ?? "builder"
    };
  }

  getApiKeys() {
    return [
      {
        id: "key_001",
        label: "Local dev key",
        keyPreview: "sk_live_****93JH",
        isActive: true
      }
    ];
  }

  createApiKey(payload: CreateApiKeyDto) {
    return {
      id: "key_002",
      label: payload.label,
      keyPreview: "sk_live_****N8KL",
      isActive: true
    };
  }

  removeApiKey(id: string) {
    return {
      deleted: true,
      id
    };
  }
}
