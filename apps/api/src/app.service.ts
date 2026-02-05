import { Injectable } from "@nestjs/common";
import type { HelloResponse } from "src/schemas/app.schema";

@Injectable()
export class AppService {
	getHello(): HelloResponse {
		return { message: "Hello World!!" };
	}
}
