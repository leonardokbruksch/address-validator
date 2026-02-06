import { Address } from "@address-validator/types";


export interface AddressProvider {
    search(input: string): Promise<Address[] | null>;
}