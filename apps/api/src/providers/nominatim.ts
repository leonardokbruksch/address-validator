import { Injectable } from "@nestjs/common"; import { Address } from "src/schemas/address.schema";
import { AddressProvider } from "./addressProvider";

export type NominatimAddress = {
    house_number?: string;
    road?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    postcode?: string;
    country_code?: string;
};

type NominatimResult = {
    address?: NominatimAddress;
};

const USER_AGENT = "address-validator-interview/1.0";

export const US_COUNTRY_CODE = "us";

@Injectable()
export class NominatimProvider implements AddressProvider {
    async search(addressText: string): Promise<Address[] | null> {
        const url = new URL("https://nominatim.openstreetmap.org/search");

        url.searchParams.set("q", addressText);
        url.searchParams.set("countrycodes", US_COUNTRY_CODE);
        url.searchParams.set("accept-language", "en");

        url.searchParams.set("format", "jsonv2");
        url.searchParams.set("addressdetails", "1");

        const response = await fetch(url.toString(), {
            headers: {
                "User-Agent": USER_AGENT,
            },
        });

        if (!response.ok) {
            throw new Error("Nominatim request failed");
        }

        const results = (await response.json()) as NominatimResult[];

        if (!results || results.length === 0) {
            return null;
        }

        return results.map((result) => (this.normalizeAddress(result?.address)));
    }


    normalizeAddress(address?: NominatimAddress): Address {
        const city = address?.city ?? address?.town ?? address?.village;
        return {
            street: address?.road,
            number: address?.house_number,
            city,
            state: address?.state,
            zipCode: address?.postcode,
        };
    }
}
