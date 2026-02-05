import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface InputCardProps {
    input: string | undefined;
    onInputChange: (value: string) => void;
    onValidate: () => void;
    isLoading: boolean;
}

export function InputCard({
    input,
    onInputChange,
    onValidate,
    isLoading,
}: InputCardProps) {
    return (
        <Card className="border-border/70">
            <CardHeader>
                <h2 className="text-lg font-semibold">Input</h2>
                <p className="text-sm text-muted-foreground">
                    U.S. addresses only. We will analyze the input and break it down into
                    normalized fields.
                </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="address-input">Address</Label>
                    <Textarea
                        id="address-input"
                        value={input}
                        onChange={(event) => onInputChange(event.target.value)}
                        placeholder="123 Market St, San Francisco, CA 94105"
                        disabled={isLoading}
                    />
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
                <Button
                    onClick={onValidate}
                    disabled={isLoading || input === undefined || input?.trim() === ""}
                >
                    {isLoading ? "Validating..." : "Validate Address"}
                </Button>
            </CardFooter>
        </Card>
    );
}
