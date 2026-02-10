import { CacheInterceptor } from "@nestjs/cache-manager";
import type { ExecutionContext } from "@nestjs/common";

export class PostCacheInterceptor extends CacheInterceptor {
	protected isRequestCacheable(context: ExecutionContext): boolean {
		const req = context.switchToHttp().getRequest();
		return req.method === "GET" || req.method === "POST";
	}

	protected trackBy(context: ExecutionContext): string | undefined {
		const req = context.switchToHttp().getRequest();
		if (req.method === "POST") {
			return `${req.originalUrl}:${JSON.stringify(req.body ?? {})}`;
		}
		return super.trackBy(context);
	}
}
