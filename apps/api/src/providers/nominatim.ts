import { Injectable } from "@nestjs/common";

type NominatimAddress = {
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

@Injectable()
export class NominatimProvider {
    async search(addressText: string): Promise<NominatimResult | null> {
        const url = new URL("https://nominatim.openstreetmap.org/search");

        url.searchParams.set("q", addressText);
        url.searchParams.set("format", "jsonv2");
        url.searchParams.set("addressdetails", "1");
        url.searchParams.set("limit", "1");

        const response = await fetch(url.toString(), {
            headers: {
                "User-Agent": "address-validator-interview/1.0",
            },
        });

        if (!response.ok) {
            throw new Error("Nominatim request failed");
        }

        const results = (await response.json()) as NominatimResult[];

        return results.length ? results[0] : null;
    }
}
