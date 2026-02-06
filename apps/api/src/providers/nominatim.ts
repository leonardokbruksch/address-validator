import { Injectable } from "@nestjs/common";

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
export class NominatimProvider {
    async search(addressText: string): Promise<NominatimResult[] | null> {
        const url = new URL("https://nominatim.openstreetmap.org/search");

        url.searchParams.set("q", addressText);
        url.searchParams.set("countrycodes", US_COUNTRY_CODE);
        url.searchParams.set("accept-language", "en");

        url.searchParams.set("format", "jsonv2");
        url.searchParams.set("addressdetails", "1");
        url.searchParams.set("limit", "1");

        const response = await fetch(url.toString(), {
            headers: {
                "User-Agent": USER_AGENT,
            },
        });

        if (!response.ok) {
            throw new Error("Nominatim request failed");
        }

        const results = (await response.json()) as NominatimResult[];

        return results.length ? results : null;
    }
}
