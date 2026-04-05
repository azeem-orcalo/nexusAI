import { Injectable } from "@nestjs/common";
import { RecommendationRequestDto } from "./dto/recommendation-request.dto";

@Injectable()
export class DiscoverService {
  onboarding() {
    return {
      steps: [
        "Select your goal",
        "Choose a budget or use case",
        "Review recommended models"
      ]
    };
  }

  recommend(payload: RecommendationRequestDto) {
    return {
      goal: payload.goal,
      recommendations: [
        { modelId: "gpt-5", reason: "Best for complex agent reasoning" },
        { modelId: "gpt-4o", reason: "Strong multimodal balance" }
      ]
    };
  }

  quickActions() {
    return [
      "Create image",
      "Generate audio",
      "Create slides",
      "Analyze data",
      "Code generation"
    ];
  }

  researchFeed() {
    return [
      {
        id: "res_001",
        title: "GPT-5.2 released",
        summary: "Improved multimodal instruction following",
        provider: "OpenAI"
      }
    ];
  }
}
