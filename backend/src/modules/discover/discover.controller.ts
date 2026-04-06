import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ListResearchFeedQueryDto } from "./dto/list-research-feed-query.dto";
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

  @Get("home-workflows")
  @ApiOperation({ summary: "Get home page workflow categories and suggestions" })
  homeWorkflows() {
    return this.discoverService.homeWorkflows();
  }

  @Get("home-use-cases")
  @ApiOperation({ summary: "Get home page quick-start use cases" })
  homeUseCases() {
    return this.discoverService.homeUseCases();
  }

  @Get("research-feed")
  @ApiOperation({ summary: "Get research and release feed items" })
  researchFeed(@Query() query: ListResearchFeedQueryDto) {
    return this.discoverService.researchFeed(query);
  }

  @Get("research-feed/filters")
  @ApiOperation({ summary: "Get discover research feed filters" })
  researchFeedFilters() {
    return this.discoverService.researchFeedFilters();
  }
}
