import { Injectable } from "@nestjs/common";
import { NominatimProvider } from "src/providers/nominatim";
import { Address, ADDRESS_STATUS, AddressStatus, ValidateAddressResponse } from "src/schemas/address.schema";
import { US_STATE_MAP } from "src/schemas/usStates";

@Injectable()
export class AddressService {
    constructor(private readonly nominatim: NominatimProvider) { }

    async validateAddress(input: string): Promise<ValidateAddressResponse> {
        const addresses = await this.nominatim.search(input);

        if (!addresses || addresses.length !== 1 || !addresses[0]) {
            return this.unverifiableResponse();
        }

        const address = addresses[0];

        if (!this.isCompleteAddress(address)) {
            return this.unverifiableResponse();
        }

        const status = this.getAddressStatus(input, address);

        //@TODO: Possibly handle Statuses with HTTP Codes 
        // (e.g. 200 for VALID, 200 with warning for CORRECTED, 422 for UNVERIFIABLE)

        return {
            ...address,
            status,
        }
    }

    unverifiableResponse(): ValidateAddressResponse {
        return {
            status: ADDRESS_STATUS.UNVERIFIABLE,
        };
    }

    isCompleteAddress(address: Address): boolean {
        return Boolean(
            address.street &&
            address.number &&
            address.city &&
            address.state &&
            address.zipCode
        );
    }

    getAddressStatus(input: string, address: Address): AddressStatus {
        if (this.isAddressCorrected(input, address)) {
            return ADDRESS_STATUS.CORRECTED;
        } else {
            return ADDRESS_STATUS.VALID;
        }
    }

    isAddressCorrected(input: string, address: Address): boolean {
        if (!this.isInputEqual(input, address.street)) return true;
        if (!this.isInputEqual(input, address.number)) return true;
        if (!this.isInputEqual(input, address.city)) return true;
        if (!this.isInputEqual(input, address.zipCode)) return true;

        if (!this.isStateEqual(input, address.state)) return true;

        return false;
    }

    isInputEqual(input: string, value?: string) {
        if (!value) {
            return false;
        }
        return input.toLowerCase().includes(value.toLowerCase());
    }

    isStateEqual(input: string, state?: string): boolean {
        // Handles semantic differences in state representation
        // Semantic differences are not counted as corrections
        // e.g. "California" vs "CA"

        if (!state) {
            return false;
        }

        const normalizedInput = input.toUpperCase();

        const canonical = this.canonicalizeState(state);

        return (
            normalizedInput.includes(canonical) ||
            normalizedInput.includes(state.toUpperCase())
        );
    }

    canonicalizeState(value: string): string {
        const upper = value.trim().toUpperCase();
        if (upper.length === 2) return upper;
        return US_STATE_MAP[upper] ?? upper;
    }
}