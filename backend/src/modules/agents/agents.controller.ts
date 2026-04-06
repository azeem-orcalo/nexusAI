import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AgentsService } from "./agents.service";
import { CreateAgentMessageDto } from "./dto/create-agent-message.dto";
import { CreateAgentTaskDto } from "./dto/create-agent-task.dto";
import { CreateAgentTaskMessageDto } from "./dto/create-agent-task-message.dto";
import { CreateAgentDto } from "./dto/create-agent.dto";
import { UpdateAgentTaskDto } from "./dto/update-agent-task.dto";
import { UpdateAgentDto } from "./dto/update-agent.dto";

@ApiTags("agents")
@Controller("agents")
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new agent" })
  create(@Body() payload: CreateAgentDto) {
    return this.agentsService.create(payload);
  }

  @Get()
  @ApiOperation({ summary: "List agents" })
  findAll() {
    return this.agentsService.findAll();
  }

  @Get("workspace-content")
  @ApiOperation({ summary: "Get agent builder landing page content" })
  workspaceContent() {
    return this.agentsService.workspaceContent();
  }

  @Get("templates")
  @ApiOperation({ summary: "List agent templates" })
  templates() {
    return this.agentsService.templates();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get an agent by id" })
  findOne(@Param("id") id: string) {
    return this.agentsService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an agent" })
  update(@Param("id") id: string, @Body() payload: UpdateAgentDto) {
    return this.agentsService.update(id, payload);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete an agent" })
  remove(@Param("id") id: string) {
    return this.agentsService.remove(id);
  }

  @Post(":id/deploy")
  @ApiOperation({ summary: "Deploy an agent" })
  deploy(@Param("id") id: string) {
    return this.agentsService.deploy(id);
  }

  @Get(":id/messages")
  @ApiOperation({ summary: "List chat messages for an agent" })
  messages(@Param("id") id: string) {
    return this.agentsService.messages(id);
  }

  @Post(":id/messages")
  @ApiOperation({ summary: "Append chat message for an agent" })
  addMessage(@Param("id") id: string, @Body() payload: CreateAgentMessageDto) {
    return this.agentsService.addMessage(id, payload);
  }

  @Get(":id/tasks")
  @ApiOperation({ summary: "List tasks for an agent" })
  tasks(@Param("id") id: string) {
    return this.agentsService.tasks(id);
  }

  @Post(":id/tasks")
  @ApiOperation({ summary: "Create task for an agent" })
  createTask(@Param("id") id: string, @Body() payload: CreateAgentTaskDto) {
    return this.agentsService.createTask(id, payload);
  }

  @Patch("tasks/:taskId")
  @ApiOperation({ summary: "Update an agent task" })
  updateTask(@Param("taskId") taskId: string, @Body() payload: UpdateAgentTaskDto) {
    return this.agentsService.updateTask(taskId, payload);
  }

  @Delete("tasks/:taskId")
  @ApiOperation({ summary: "Delete an agent task" })
  deleteTask(@Param("taskId") taskId: string) {
    return this.agentsService.deleteTask(taskId);
  }

  @Post("tasks/:taskId/duplicate")
  @ApiOperation({ summary: "Duplicate an agent task" })
  duplicateTask(@Param("taskId") taskId: string) {
    return this.agentsService.duplicateTask(taskId);
  }

  @Post("tasks/:taskId/messages")
  @ApiOperation({ summary: "Append task history message" })
  addTaskMessage(
    @Param("taskId") taskId: string,
    @Body() payload: CreateAgentTaskMessageDto
  ) {
    return this.agentsService.addTaskMessage(taskId, payload);
  }
}
