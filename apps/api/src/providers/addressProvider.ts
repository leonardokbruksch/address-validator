import { Address } from "@address-validator/types";

export const ADDRESS_PROVIDER = "ADDRESS_PROVIDER";


export interface AddressProvider {
    search(input: string): Promise<Address[] | null>;
}
