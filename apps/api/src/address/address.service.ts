import { Injectable } from "@nestjs/common";
import { NominatimProvider } from "src/providers/nominatim";
import { ValidateAddressResponse } from "src/schemas/address.schema";

@Injectable()
export class AddressService {
    constructor(private readonly nominatim: NominatimProvider) { }

    async validateAddress(addressText: string): Promise<ValidateAddressResponse> {
        const result = await this.nominatim.search(addressText);

        if (!result?.address) {
            return {};
        }

        const address = result.address;

        if (address.country_code !== "us") {
            return {};
        }

        return {
            street: address.road,
            number: address.house_number,
            city: address.city ?? address.town ?? address.village,
            state: address.state,
            zipCode: address.postcode,
        };
    }
}
