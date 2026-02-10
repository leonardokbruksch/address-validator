import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { ZodSerializerInterceptor, ZodValidationPipe } from "nestjs-zod";
import { LoggerMiddleware } from "./middleware/loggerMiddleware";
import { AddressModule } from "./address/address.module";
import { CacheInterceptor, CacheModule } from "@nestjs/cache-manager";
import KeyvRedis from "@keyv/redis";

const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

@Module({
	imports: [
		AddressModule,
		CacheModule.registerAsync({
			isGlobal: true,
			useFactory: () => ({
				stores: [
					new KeyvRedis(REDIS_URL),
				],
				ttl: 3_600_000, // 1 hour in milliseconds
			}),
		}),
	],
	controllers: [],
	providers: [
		{
			provide: APP_PIPE,
			useClass: ZodValidationPipe,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ZodSerializerInterceptor,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: CacheInterceptor,
		}
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(LoggerMiddleware)
			.forRoutes("*");
	}
}
