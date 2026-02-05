import { Body, Controller, Get, Post } from "@nestjs/common";
import type { HelloResponse } from "src/schemas/app.schema";
import {
	HelloRequestDto,
	HelloResponseDto,
} from "src/schemas/app.schema";
import { ZodSerializerDto } from "nestjs-zod";
import { AppService } from "./app.service";

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) { }

	@Get()
	@ZodSerializerDto(HelloResponseDto)
	getHello(): HelloResponse {
		return this.appService.getHello();
	}

	@Post()
	@ZodSerializerDto(HelloResponseDto)
	sendHello(@Body() request: HelloRequestDto) {
		return { message: `Hello sir ${request.name}` };
	}
}
