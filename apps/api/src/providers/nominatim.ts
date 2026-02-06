import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { AddressProvider } from "./addressProvider";
import { Address } from "@address-validator/types";

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

const NOMINATIM_API = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "address-validator-interview/1.0";

export const US_COUNTRY_CODE = "us";

@Injectable()
export class NominatimProvider implements AddressProvider {
    private readonly maxRetries = 3;
    private readonly retryDelayMs = 1000;

    async search(addressText: string): Promise<Address[] | null> {
        const url = this.buildUrl(addressText);
        const response = await this.fetchWithRetry(url);
        return this.parseResults(response);
    }

    private buildUrl(addressText: string): URL {
        const url = new URL(NOMINATIM_API);

        url.searchParams.set("q", addressText);
        url.searchParams.set("countrycodes", US_COUNTRY_CODE);
        url.searchParams.set("format", "jsonv2");
        url.searchParams.set("addressdetails", "1");
        url.searchParams.set("featuretype", "address");
        url.searchParams.set("accept-language", "en-US");

        return url;
    }

    private async fetchWithRetry(url: URL): Promise<Response> {
        for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
            try {
                const response = await fetch(url.toString(), {
                    headers: { "User-Agent": USER_AGENT },
                });

                if (!response.ok) {
                    if (this.shouldRetry(response.status) && attempt < this.maxRetries) {
                        await this.delay(this.retryDelayMs);
                        continue;
                    }
                    throw new ServiceUnavailableException(`Nominatim request failed with status ${response.status}`);
                }

                return response;
            } catch (error) {
                if (attempt < this.maxRetries) {
                    await this.delay(this.retryDelayMs);
                    continue;
                }
                throw error;
            }
        }

        throw new ServiceUnavailableException("Unreachable");
    }

    private shouldRetry(status: number): boolean {
        return status === 429 || status >= 500;
    }

    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    private async parseResults(response: Response): Promise<Address[] | null> {
        return await response.json().then((results: NominatimResult[]) => {
            if (!results || results.length === 0) {
                return null;
            }
            return results.map((r) => this.normalizeAddress(r.address));
        });
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
