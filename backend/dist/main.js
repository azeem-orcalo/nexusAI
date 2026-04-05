"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
        credentials: true
    });
    app.setGlobalPrefix("api");
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle("NexusAI API")
        .setDescription("Schema-first NestJS API for NexusAI")
        .setVersion("1.0.0")
        .addTag("auth")
        .addTag("models")
        .addTag("agents")
        .addTag("dashboard")
        .addTag("discover")
        .addTag("account")
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("docs", app, document);
    await app.listen(3000);
}
void bootstrap();
//# sourceMappingURL=main.js.map