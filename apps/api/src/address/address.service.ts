import { Address, ADDRESS_STATUS, AddressStatus, ValidateAddressResponse } from "@address-validator/types";
import { BadGatewayException, Inject, Injectable } from "@nestjs/common";
import * as addressProvider from "../providers/addressProvider";
import { US_STATE_MAP } from "../schemas/usStates";

@Injectable()
export class AddressService {
    constructor(
        @Inject(addressProvider.ADDRESS_PROVIDER) private readonly provider: addressProvider.AddressProvider,
    ) { }

    async validateAddress(input: string): Promise<ValidateAddressResponse> {
        let addresses: Address[] | null = null;
        try {
            addresses = await this.provider.search(input);
        } catch (error) {
            console.error("Address provider error:", error);
            throw new BadGatewayException("Address provider error");
        }

        if (!addresses || addresses.length !== 1 || !addresses[0]) {
            return this.unverifiableResponse();
        }

        const address = addresses[0];

        if (!this.isCompleteAddress(address)) {
            return this.unverifiableResponse();
        }

        const status = this.getAddressStatus(input, address);

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
        /**
         * Handles semantic differences in state representation
         * Semantic differences are not counted as corrections
         * e.g. "California" vs "CA"
         */

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
