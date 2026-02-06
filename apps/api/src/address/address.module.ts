import { Module } from "@nestjs/common";
import { AddressController } from "./address.controller";
import { AddressService } from "./address.service";
import { ADDRESS_PROVIDER } from "src/providers/addressProvider";
import { NominatimProvider } from "src/providers/nominatim";

@Module({
    controllers: [AddressController],
    providers: [
        AddressService,
        {
            provide: ADDRESS_PROVIDER,
            useClass: NominatimProvider,
        },
    ],
})
export class AddressModule { }
