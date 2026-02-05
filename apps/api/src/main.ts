import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { GlobalExceptionsFilter } from "./filters/globalExceptionFilter";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalFilters(new GlobalExceptionsFilter());
	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
