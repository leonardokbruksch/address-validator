import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";

export default function ReadonlyField({
    label,
    value,
    loading,
}: {
    label: string;
    value?: string;
    loading: boolean;
}) {
    return (
        <div className="grid gap-3">
            <Label>{label}</Label>
            {loading ? (
                <Skeleton className="h-10 w-full" />
            ) : (
                <Input value={value ?? ""} readOnly />
            )}
        </div>
    );
}
