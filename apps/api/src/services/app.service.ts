import { Injectable } from "@nestjs/common";
import type { HelloResponse } from "src/schemas/hello.schema";

@Injectable()
export class AppService {
	getHello(): HelloResponse {
		return { message: "Hello World!!" };
	}
}
