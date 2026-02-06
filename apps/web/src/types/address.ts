export const ADDRESS_STATUS = {
    VALID: "VALID",
    CORRECTED: "CORRECTED",
    UNVERIFIABLE: "UNVERIFIABLE",
} as const;

export type AddressStatus =
    typeof ADDRESS_STATUS[keyof typeof ADDRESS_STATUS];

export type StructuredAddress = {
    street?: string;
    number?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    status?: AddressStatus;
};
