import { Injectable } from "@nestjs/common";
import { GoogleAddressValidationProvider } from "src/providers/google";
import { NominatimProvider, US_COUNTRY_CODE } from "src/providers/nominatim";
import { ADDRESS_STATUS, ValidateAddressResponse } from "src/schemas/address.schema";

@Injectable()
export class AddressService {
    constructor(private readonly nominatim: NominatimProvider, private readonly google: GoogleAddressValidationProvider) { }

    async validateAddress(addressText: string): Promise<ValidateAddressResponse> {
        const results = await this.nominatim.search(addressText);

        const address =
            results && results.length === 1
                ? results[0]?.address
                : null;

        if (!address || address?.country_code !== US_COUNTRY_CODE) {
            return {
                status: ADDRESS_STATUS.UNVERIFIABLE,
            };
        }

        return {
            street: address.road,
            number: address.house_number,
            city: address.city ?? address.town ?? address.village,
            state: address.state,
            zipCode: address.postcode,
            status: ADDRESS_STATUS.CORRECTED, // @TODO: Implement better logic to determine if the address is valid or corrected
        };
    }

    // async validateWithGoogle(
    //     addressText: string,
    // ): Promise<ValidateAddressResponse & { status: AddressStatus }> {
    //     console.log("Validating with Google:", addressText);
    //     const result = await this.google.validate(addressText);
    //     console.log("Google validation result:", result);
    //     if (!result) {
    //         return { status: "unverifiable" };
    //     }

    //     const components = result.address.addressComponents;

    //     console.log("Address components:", components);

    //     const get = (type: string) =>
    //         components.find(c => c.componentType === type)?.componentName.text;

    //     const street = get("route");
    //     const number = get("street_number");
    //     const city = get("locality");
    //     const state = get("administrative_area_level_1");
    //     const zipCode = get("postal_code");

    //     if (!result.verdict.addressComplete) {
    //         return {
    //             street,
    //             number,
    //             city,
    //             state,
    //             zipCode,
    //             status: "unverifiable",
    //         };
    //     }

    //     if (result.verdict.hasUnconfirmedComponents) {
    //         return {
    //             street,
    //             number,
    //             city,
    //             state,
    //             zipCode,
    //             status: "corrected",
    //         };
    //     }

    //     return {
    //         street,
    //         number,
    //         city,
    //         state,
    //         zipCode,
    //         status: "valid",
    //     };
    // }


}
