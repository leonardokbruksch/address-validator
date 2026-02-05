import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const HelloResponseSchema = z.object({
  message: z.string(),
});

export class HelloResponseDto extends createZodDto(
  HelloResponseSchema,
) { }

export type HelloResponse = z.infer<typeof HelloResponseSchema>;

export const HelloRequestSchema = z.object({
  name: z.string(),
});

export class HelloRequestDto extends createZodDto(
  HelloRequestSchema,
) { }

export type HelloRequest = z.infer<typeof HelloRequestSchema>;