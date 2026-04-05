import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CompareModelsDto } from "./dto/compare-models.dto";
import { ListModelsQueryDto } from "./dto/list-models-query.dto";
import { ModelsService } from "./models.service";

@ApiTags("models")
@Controller("models")
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Get()
  @ApiOperation({ summary: "List models with provider/category/search filters" })
  findAll(@Query() query: ListModelsQueryDto) {
    return this.modelsService.findAll(query);
  }

  @Get("featured")
  @ApiOperation({ summary: "Get featured marketplace models" })
  featured() {
    return this.modelsService.featured();
  }

  @Get("providers")
  @ApiOperation({ summary: "List AI labs/providers" })
  providers() {
    return this.modelsService.providers();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get full model details" })
  findOne(@Param("id") id: string) {
    return this.modelsService.findOne(id);
  }

  @Get(":id/reviews")
  @ApiOperation({ summary: "Get verified reviews for a model" })
  reviews(@Param("id") id: string) {
    return this.modelsService.reviews(id);
  }

  @Post("compare")
  @ApiOperation({ summary: "Compare multiple models side by side" })
  compare(@Body() payload: CompareModelsDto) {
    return this.modelsService.compare(payload);
  }
}
