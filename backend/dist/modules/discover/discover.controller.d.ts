import { ListResearchFeedQueryDto } from "./dto/list-research-feed-query.dto";
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
    homeWorkflows(): {
        categories: {
            id: string;
            label: string;
            icon: string;
            suggestions: string[];
        }[];
    };
    homeUseCases(): {
        title: string;
        subtitle: string;
        items: {
            id: string;
            title: string;
            description: string;
            providers: string[];
            actionLabel: string;
            prompt: string;
            icon: string;
        }[];
    };
    researchFeed(query: ListResearchFeedQueryDto): {
        id: string;
        title: string;
        summary: string;
        provider: string;
        category: string;
        publishedAt: string;
        overview: string;
        metrics: {
            label: string;
            value: string;
        }[];
        findings: string[];
        modelsReferenced: string[];
    }[];
    researchFeedFilters(): {
        categories: string[];
    };
}
