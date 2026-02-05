import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { GlobalExceptionsFilter } from "./filters/globalExceptionFilter";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalFilters(new GlobalExceptionsFilter());

	app.enableCors({
		origin: true,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	});

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
