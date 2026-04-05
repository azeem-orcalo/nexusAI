import { CreateApiKeyDto } from "./dto/create-api-key.dto";
import { UpdateSettingsDto } from "./dto/update-settings.dto";
export declare class AccountService {
    getSettings(): {
        language: string;
        persona: string;
    };
    updateSettings(payload: UpdateSettingsDto): {
        language: string;
        persona: string;
    };
    getApiKeys(): {
        id: string;
        label: string;
        keyPreview: string;
        isActive: boolean;
    }[];
    createApiKey(payload: CreateApiKeyDto): {
        id: string;
        label: string;
        keyPreview: string;
        isActive: boolean;
    };
    removeApiKey(id: string): {
        deleted: boolean;
        id: string;
    };
}
