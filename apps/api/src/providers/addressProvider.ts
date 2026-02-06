import { Address } from "src/schemas/address.schema";

export interface AddressProvider {
    search(input: string): Promise<Address[] | null>;
}