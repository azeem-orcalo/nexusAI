import { RecommendationRequestDto } from "./dto/recommendation-request.dto";
export declare class DiscoverService {
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
