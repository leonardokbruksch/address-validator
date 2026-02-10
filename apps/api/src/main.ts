import { VersioningType } from "@nestjs/common";
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

	// Default to v1 when no version segment is present in the URI.
	app.use((req, _res, next) => {
		if (!/^\/v\d+(\/|$)/.test(req.url)) {
			req.url = `/v1${req.url === "/" ? "" : req.url}`;
		}
		next();
	});

	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: "1",
	});

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
