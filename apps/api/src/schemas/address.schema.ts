import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const ValidateAddressRequestSchema = z.object({
    address: z.string(),
});

export class ValidateAddressRequestDto extends createZodDto(
    ValidateAddressRequestSchema,
) { }

export type ValidateAddressRequest = z.infer<typeof ValidateAddressRequestSchema>;

export const ValidateAddressResponseSchema = z.object({
    street: z.string().optional(),
    number: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
});

export class ValidateAddressResponseDto extends createZodDto(
    ValidateAddressResponseSchema,
) { }

export type ValidateAddressResponse = z.infer<typeof ValidateAddressResponseSchema>;