import { ListResearchFeedQueryDto } from "./dto/list-research-feed-query.dto";
import { RecommendationRequestDto } from "./dto/recommendation-request.dto";
export declare class DiscoverService {
    private readonly chatHubSidebarContent;
    private readonly homeWorkflowCategories;
    private readonly homeUseCaseItems;
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
    chatHubContent(): {
        quickActions: {
            id: string;
            label: string;
            icon: string;
        }[];
        createActions: {
            id: string;
            label: string;
            icon: string;
        }[];
        analysisActions: {
            id: string;
            label: string;
            icon: string;
        }[];
        promptOptions: {
            id: string;
            title: string;
            subtitle: string;
            icon: string;
        }[];
        promptCategories: {
            id: string;
            label: string;
        }[];
        promptSuggestions: {
            id: string;
            categoryId: string;
            label: string;
            prompt: string;
        }[];
    };
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
    private readonly researchFeedItems;
    researchFeed(query?: ListResearchFeedQueryDto): {
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
