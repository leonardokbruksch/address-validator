import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { ZodSerializerInterceptor, ZodValidationPipe } from "nestjs-zod";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LoggerMiddleware } from "./middleware/loggerMiddleware";
import { AddressModule } from "./address/address.module";

@Module({
	imports: [AddressModule],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_PIPE,
			useClass: ZodValidationPipe,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ZodSerializerInterceptor,
		},
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(LoggerMiddleware)
			.forRoutes("*");
	}
}
