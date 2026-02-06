import { Body, Controller, Post } from "@nestjs/common";
import { ZodSerializerDto } from "nestjs-zod";
import { AddressService } from "./address.service";
import { ValidateAddressRequestDto, ValidateAddressResponseDto } from "../schemas/address.schema";

@Controller("validate-address")
export class AddressController {
	constructor(private readonly addressService: AddressService) { }

	@Post()
	@ZodSerializerDto(ValidateAddressResponseDto)
	sendHello(@Body() request: ValidateAddressRequestDto) {
		return this.addressService.validateAddress(request.address);
	}
}
