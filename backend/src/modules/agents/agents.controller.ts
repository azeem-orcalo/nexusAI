import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AgentsService } from "./agents.service";
import { CreateAgentDto } from "./dto/create-agent.dto";
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
}
