
import type { AddressStatus } from "@address-validator/types";
import { Skeleton } from "./ui/skeleton";

const STATUS_STYLES: Record<
    AddressStatus,
    string
> = {
    VALID: "bg-green-100 text-green-800",
    CORRECTED: "bg-yellow-100 text-yellow-800",
    UNVERIFIABLE: "bg-red-100 text-red-800",
};

export default function StatusBadge({
    status,
    loading,
}: {
    status?: AddressStatus;
    loading: boolean;
}) {
    if (loading) {
        return <Skeleton className="h-6 w-24" />;
    }

    if (!status) {
        return null;
    }

    return (
        <span
            className={`text-sm font-semibold px-3 py-1 rounded-full ${STATUS_STYLES[status]
                }`}
        >
            {status}
        </span>
    );
}
