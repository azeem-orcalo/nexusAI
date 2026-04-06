import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Agent, AgentSchema } from "./schemas/agent.schema";
import { AgentsController } from "./agents.controller";
import { AgentsService } from "./agents.service";
import { AgentMessage, AgentMessageSchema } from "./schemas/agent-message.schema";
import { AgentTask, AgentTaskSchema } from "./schemas/agent-task.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Agent.name, schema: AgentSchema },
      { name: AgentMessage.name, schema: AgentMessageSchema },
      { name: AgentTask.name, schema: AgentTaskSchema }
    ])
  ],
  controllers: [AgentsController],
  providers: [AgentsService]
})
export class AgentsModule {}
