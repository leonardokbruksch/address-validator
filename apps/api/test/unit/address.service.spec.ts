import { Address, ADDRESS_STATUS } from "@address-validator/types";
import { AddressService } from "../../src/address/address.service";
import { NominatimProvider } from "../../src/providers/nominatim";

describe("AddressService", () => {
    let service: AddressService;
    let nominatim: { search: jest.Mock };

    beforeEach(() => {
        nominatim = { search: jest.fn() };
        service = new AddressService(nominatim as unknown as NominatimProvider);
    });

    it("returns UNVERIFIABLE when search returns null", async () => {
        nominatim.search.mockResolvedValue(null);

        const res = await service.validateAddress("anything");

        expect(res).toEqual({ status: ADDRESS_STATUS.UNVERIFIABLE });
    });

    it("returns UNVERIFIABLE when search returns multiple results", async () => {
        nominatim.search.mockResolvedValue([
            { street: "A", number: "1", city: "C", state: "S", zipCode: "Z" },
            { street: "B", number: "2", city: "D", state: "T", zipCode: "Y" },
        ]);

        const res = await service.validateAddress("input");

        expect(res).toEqual({ status: ADDRESS_STATUS.UNVERIFIABLE });
    });

    it("returns UNVERIFIABLE when address is incomplete", async () => {
        nominatim.search.mockResolvedValue([
            { street: "Main", number: "1", city: "C", state: "S" },
        ]);

        const res = await service.validateAddress("1 Main C S");

        expect(res).toEqual({ status: ADDRESS_STATUS.UNVERIFIABLE });
    });

    it("returns VALID when input already matches normalized address", async () => {
        const address: Address = {
            street: "Main St",
            number: "123",
            city: "Springfield",
            state: "IL",
            zipCode: "62704",
        };
        nominatim.search.mockResolvedValue([address]);

        const res = await service.validateAddress("123 Main St Springfield IL 62704");

        expect(res).toEqual({ ...address, status: ADDRESS_STATUS.VALID });
    });

    it("returns CORRECTED when input differs from normalized address", async () => {
        const address: Address = {
            street: "Main St",
            number: "123",
            city: "Springfield",
            state: "IL",
            zipCode: "62704",
        };
        nominatim.search.mockResolvedValue([address]);

        const res = await service.validateAddress("123 Main St Springfield IL");

        expect(res).toEqual({ ...address, status: ADDRESS_STATUS.CORRECTED });
    });

    it("treats full state name as equivalent to abbreviation", () => {
        expect(service.isStateEqual("123 Main St, California", "CA")).toBe(true);
        expect(service.isStateEqual("123 Main St, CA", "California")).toBe(true);
    });
});
