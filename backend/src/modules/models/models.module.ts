import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ModelsController } from "./models.controller";
import { ModelsService } from "./models.service";
import { Model, ModelSchema } from "./schemas/model.schema";
import { Review, ReviewSchema } from "./schemas/review.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Model.name, schema: ModelSchema },
      { name: Review.name, schema: ReviewSchema }
    ])
  ],
  controllers: [ModelsController],
  providers: [ModelsService]
})
export class ModelsModule {}
