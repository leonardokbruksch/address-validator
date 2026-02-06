import { NominatimProvider } from "../../src/providers/nominatim";

describe("NominatimProvider", () => {
    let provider: NominatimProvider;
    const originalFetch = global.fetch;

    beforeEach(() => {
        provider = new NominatimProvider();
        // prevent real delays during tests
        (provider as any).delay = jest.fn().mockResolvedValue(undefined);
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
        global.fetch = originalFetch;
    });

    it("returns normalized addresses on successful response", async () => {
        const results = [
            {
                address: {
                    road: "Main St",
                    house_number: "123",
                    city: "Springfield",
                    state: "IL",
                    postcode: "62704",
                },
            },
        ];

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => results,
        });

        const res = await provider.search("123 Main St");

        expect(res).toEqual([
            {
                street: "Main St",
                number: "123",
                city: "Springfield",
                state: "IL",
                zipCode: "62704",
            },
        ]);
        expect(global.fetch).toHaveBeenCalled();
    });

    it("returns null when API returns empty array", async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => [],
        });

        const res = await provider.search("no results");
        expect(res).toBeNull();
    });

    it("retries on server error then succeeds", async () => {
        const results = [
            { address: { road: "A", house_number: "1", city: "C", state: "S", postcode: "P" } },
        ];

        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({ ok: false, status: 500 })
            .mockResolvedValueOnce({ ok: true, status: 200, json: async () => results });

        const res = await provider.search("1 A St");

        expect((global.fetch as jest.Mock).mock.calls.length).toBeGreaterThanOrEqual(2);
        expect(res).toEqual([
            { street: "A", number: "1", city: "C", state: "S", zipCode: "P" },
        ]);
    });

    describe("normalizeAddress", () => {
        it("selects city, falls back to town and village", () => {
            expect(provider.normalizeAddress({ city: "City" })).toEqual(
                expect.objectContaining({ city: "City" }),
            );
            expect(provider.normalizeAddress({ town: "Town" })).toEqual(
                expect.objectContaining({ city: "Town" }),
            );
            expect(provider.normalizeAddress({ village: "Village" })).toEqual(
                expect.objectContaining({ city: "Village" }),
            );
        });

        it("maps fields correctly", () => {
            const out = provider.normalizeAddress({
                road: "R",
                house_number: "10",
                city: "X",
                state: "Y",
                postcode: "Z",
            });

            expect(out).toEqual({ street: "R", number: "10", city: "X", state: "Y", zipCode: "Z" });
        });
    });
});
