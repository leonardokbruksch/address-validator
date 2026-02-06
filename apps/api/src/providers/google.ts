import { Injectable } from "@nestjs/common";

type GoogleAddressComponent = {
    componentName: {
        text: string;
        languageCode: string;
    };
    componentType: string;
    confirmationLevel: "CONFIRMED" | "UNCONFIRMED";
};

type GoogleAddress = {
    addressComponents: GoogleAddressComponent[];
};

type GoogleVerdict = {
    addressComplete: boolean;
    hasUnconfirmedComponents: boolean;
};

type GoogleValidationResult = {
    verdict: GoogleVerdict;
    address: GoogleAddress;
};

type GoogleValidationResponse = {
    result?: GoogleValidationResult;
};

@Injectable()
export class GoogleAddressValidationProvider {
    private readonly endpoint =
        "https://addressvalidation.googleapis.com/v1:validateAddress";

    async validate(addressText: string): Promise<GoogleValidationResult | null> {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
            throw new Error("Missing GOOGLE_MAPS_API_KEY");
        }

        const response = await fetch(`${this.endpoint}?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                address: {
                    addressLines: [addressText],
                    regionCode: "US",
                },
            }),
        });

        if (!response.ok) {
            throw new Error("Google address validation failed");
        }

        const data = (await response.json()) as GoogleValidationResponse;

        return data.result ?? null;
    }
}
