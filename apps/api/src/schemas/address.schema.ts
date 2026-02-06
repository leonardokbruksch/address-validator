import { createZodDto } from "nestjs-zod";
import {
    ValidateAddressRequestSchema,
    ValidateAddressResponseSchema,
} from "@address-validator/types";

export class ValidateAddressRequestDto extends createZodDto(
    ValidateAddressRequestSchema,
) { }

export class ValidateAddressResponseDto extends createZodDto(
    ValidateAddressResponseSchema,
) { }
