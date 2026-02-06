import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const ValidateAddressRequestSchema = z.object({
    address: z.string(),
});

export class ValidateAddressRequestDto extends createZodDto(
    ValidateAddressRequestSchema,
) { }

export type ValidateAddressRequest = z.infer<typeof ValidateAddressRequestSchema>;

export const ADDRESS_STATUS = {
    VALID: "VALID",
    CORRECTED: "CORRECTED",
    UNVERIFIABLE: "UNVERIFIABLE",
} as const;

export const AddressStatusEnum = z.enum([
    ADDRESS_STATUS.VALID,
    ADDRESS_STATUS.CORRECTED,
    ADDRESS_STATUS.UNVERIFIABLE,
]);

export type AddressStatus =
    (typeof ADDRESS_STATUS)[keyof typeof ADDRESS_STATUS];

export const ValidateAddressResponseSchema = z.object({
    street: z.string().optional(),
    number: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    status: AddressStatusEnum,
});
export class ValidateAddressResponseDto extends createZodDto(
    ValidateAddressResponseSchema,
) { }

export type ValidateAddressResponse = z.infer<typeof ValidateAddressResponseSchema>;