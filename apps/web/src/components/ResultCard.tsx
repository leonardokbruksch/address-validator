import type { StructuredAddress } from "@/App";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface ResultCardProps {
    result: StructuredAddress | undefined;
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
                <div className="grid gap-3">
                    <Label>Street</Label>
                    {loading ? (
                        <Skeleton className="h-10 w-full" />
                    ) : (
                        <Input value={result?.street ?? ""} readOnly />
                    )}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="grid gap-3">
                        <Label>Number</Label>
                        {loading ? (
                            <Skeleton className="h-10 w-full" />
                        ) : (
                            <Input value={result?.number ?? ""} readOnly />
                        )}
                    </div>
                    <div className="grid gap-3">
                        <Label>City</Label>
                        {loading ? (
                            <Skeleton className="h-10 w-full" />
                        ) : (
                            <Input value={result?.city ?? ""} readOnly />
                        )}
                    </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="grid gap-3">
                        <Label>State</Label>
                        {loading ? (
                            <Skeleton className="h-10 w-full" />
                        ) : (
                            <Input value={result?.state ?? ""} readOnly />
                        )}
                    </div>
                    <div className="grid gap-3">
                        <Label>Zip Code</Label>
                        {loading ? (
                            <Skeleton className="h-10 w-full" />
                        ) : (
                            <Input value={result?.zipCode ?? ""} readOnly />
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
