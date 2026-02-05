import { Body, Controller, Get, Post } from "@nestjs/common";
import type { HelloResponse } from "src/schemas/hello.schema";
import {
	HelloRequestDto,
	HelloResponseDto,
	HelloResponseSchema,
} from "src/schemas/hello.schema";
import { AppService } from "../services/app.service";
import { ZodSerializerDto } from "nestjs-zod";

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) { }

	@Get()
	@ZodSerializerDto(HelloResponseDto)
	getHello(): HelloResponse {
		// return this.appService.getHello();
		console.log("running...");
		return { test: "test" } as any;
	}

	@Post()
	@ZodSerializerDto(HelloResponseDto)
	sendHello(@Body() request: HelloRequestDto) {
		return { message: `Hello sir ${request.name}` };
	}
}
