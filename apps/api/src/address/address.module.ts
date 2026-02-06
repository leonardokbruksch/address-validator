import { Module } from "@nestjs/common";
import { AddressController } from "./address.controller";
import { AddressService } from "./address.service";
import { NominatimProvider } from "src/providers/nominatim";
import { GoogleAddressValidationProvider } from "src/providers/google";

@Module({
    controllers: [AddressController],
    providers: [AddressService, NominatimProvider, GoogleAddressValidationProvider],
})
export class AddressModule { }
