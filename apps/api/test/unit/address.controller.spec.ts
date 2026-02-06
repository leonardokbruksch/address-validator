import { AddressController } from "../../src/address/address.controller";
import { AddressService } from "../../src/address/address.service";
import { ADDRESS_STATUS } from "../../src/schemas/address.schema";

describe("AddressController", () => {
    it("delegates to AddressService.validateAddress with request address", async () => {
        const service = {
            validateAddress: jest.fn().mockResolvedValue({ status: ADDRESS_STATUS.VALID }),
        } as unknown as AddressService;

        const controller = new AddressController(service);

        const res = await controller.sendHello({ address: "123 Main St" });

        expect(service.validateAddress).toHaveBeenCalledWith("123 Main St");
        expect(res).toEqual({ status: ADDRESS_STATUS.VALID });
    });
});
