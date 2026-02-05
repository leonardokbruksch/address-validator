import { Injectable } from "@nestjs/common";
import { ValidateAddressResponse } from "src/schemas/address.schema";
import type { HelloResponse } from "src/schemas/app.schema";

@Injectable()
export class AddressService {
    validateAddress(addressText: string): ValidateAddressResponse {
        return { street: "123 Main St", city: "Anytown", state: "CA", zipCode: "12345" };
    }
}
