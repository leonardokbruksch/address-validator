import { Module } from "@nestjs/common";
import { AddressController } from "./address.controller";
import { AddressService } from "./address.service";
import { NominatimProvider } from "src/providers/nominatim";

@Module({
    controllers: [AddressController],
    providers: [AddressService, NominatimProvider],
})
export class AddressModule { }
