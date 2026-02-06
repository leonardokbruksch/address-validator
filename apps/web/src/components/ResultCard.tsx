
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import StatusBadge from "./StatusBadge";
import ReadonlyField from "./ReadonlyField";
import type { StructuredAddress } from "@address-validator/types";

interface ResultCardProps {
    result?: StructuredAddress;
    loading: boolean;
}

export function ResultCard({ result, loading }: ResultCardProps) {
    if (!result && !loading) {
        return null;
    }

    return (
        <Card className="border-border/70">
            <CardHeader>
                <h2 className="text-lg font-semibold">Structured Output</h2>
                <p className="text-sm text-muted-foreground">
                    Normalized fields for downstream systems.
                </p>
            </CardHeader>

            <CardContent className="grid gap-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <span className="text-sm font-medium">Status:</span>
                    <StatusBadge
                        status={result?.status}
                        loading={loading}
                    />
                </div>

                <ReadonlyField
                    label="Street"
                    value={result?.street}
                    loading={loading}
                />

                <div className="grid gap-3 sm:grid-cols-2">
                    <ReadonlyField
                        label="Number"
                        value={result?.number}
                        loading={loading}
                    />
                    <ReadonlyField
                        label="City"
                        value={result?.city}
                        loading={loading}
                    />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <ReadonlyField
                        label="State"
                        value={result?.state}
                        loading={loading}
                    />
                    <ReadonlyField
                        label="Zip Code"
                        value={result?.zipCode}
                        loading={loading}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
