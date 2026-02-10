import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";
import { ZodSerializerDto } from "nestjs-zod";
import { AddressService } from "./address.service";
import { ValidateAddressRequestDto, ValidateAddressResponseDto } from "../schemas/address.schema";
import { PostCacheInterceptor } from "../cache/post-cache.interceptor";

@Controller({ path: "validate-address", version: "1" })
export class AddressController {
	constructor(private readonly addressService: AddressService) { }

	@Post()
	@UseInterceptors(PostCacheInterceptor)
	@ZodSerializerDto(ValidateAddressResponseDto)
	validateAddress(@Body() request: ValidateAddressRequestDto) {
		return this.addressService.validateAddress(request.address);
	}

}
