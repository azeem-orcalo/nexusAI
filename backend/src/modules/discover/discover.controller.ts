import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RecommendationRequestDto } from "./dto/recommendation-request.dto";
import { DiscoverService } from "./discover.service";

@ApiTags("discover")
@Controller("discover")
export class DiscoverController {
  constructor(private readonly discoverService: DiscoverService) {}

  @Get("onboarding")
  @ApiOperation({ summary: "Get onboarding questionnaire metadata" })
  onboarding() {
    return this.discoverService.onboarding();
  }

  @Post("recommendations")
  @ApiOperation({ summary: "Get guided model recommendations" })
  recommend(@Body() payload: RecommendationRequestDto) {
    return this.discoverService.recommend(payload);
  }

  @Get("quick-actions")
  @ApiOperation({ summary: "Get chat hub quick actions" })
  quickActions() {
    return this.discoverService.quickActions();
  }

  @Get("research-feed")
  @ApiOperation({ summary: "Get research and release feed items" })
  researchFeed() {
    return this.discoverService.researchFeed();
  }
}
