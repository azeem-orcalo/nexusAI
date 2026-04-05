import { RecommendationRequestDto } from "./dto/recommendation-request.dto";
import { DiscoverService } from "./discover.service";
export declare class DiscoverController {
    private readonly discoverService;
    constructor(discoverService: DiscoverService);
    onboarding(): {
        steps: string[];
    };
    recommend(payload: RecommendationRequestDto): {
        goal: string;
        recommendations: {
            modelId: string;
            reason: string;
        }[];
    };
    quickActions(): string[];
    researchFeed(): {
        id: string;
        title: string;
        summary: string;
        provider: string;
    }[];
}
