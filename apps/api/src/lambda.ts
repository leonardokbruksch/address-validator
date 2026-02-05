import serverlessExpress from "@codegenie/serverless-express";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import type { Callback, Context, Handler } from "aws-lambda";
import express from "express";
import { GlobalExceptionsFilter } from "./filters/globalExceptionFilter";
import { AppModule } from "./app.module";

let server: Handler;

async function bootstrap() {
	const expressApp = express();
	const adapter = new ExpressAdapter(expressApp);

	const app = await NestFactory.create(AppModule, adapter);

	app.useGlobalFilters(new GlobalExceptionsFilter());

	app.enableCors({
		origin: true,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	});

	await app.init();

	return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
	event: unknown,
	context: Context,
	callback: Callback,
) => {
	server = server ?? (await bootstrap());
	return server(event, context, callback);
};
