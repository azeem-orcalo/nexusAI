import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DiscoverController } from "./discover.controller";
import { DiscoverService } from "./discover.service";
import { ResearchItem, ResearchItemSchema } from "./schemas/research-item.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ResearchItem.name, schema: ResearchItemSchema }
    ])
  ],
  controllers: [DiscoverController],
  providers: [DiscoverService]
})
export class DiscoverModule {}
