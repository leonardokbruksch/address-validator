import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type StructuredAddress = {
	street: string;
	number: string;
	city: string;
	state: string;
	zipCode: string;
};

const MOCK_STRUCTURED: StructuredAddress = {
	street: "Amphitheatre Pkwy",
	number: "1600",
	city: "Mountain View",
	state: "CA",
	zipCode: "94043",
};

const DEFAULT_INPUT =
	"1600 Amphitheatre Pkwy, Mountain View, CA 94043";

function App() {
	const [input, setInput] = useState(DEFAULT_INPUT);
	const [result, setResult] = useState<StructuredAddress | null>(
		MOCK_STRUCTURED,
	);

	const isValidatable = useMemo(() => input.trim().length > 6, [input]);

	const handleValidate = () => {
		if (!isValidatable) {
			return;
		}
		setResult(MOCK_STRUCTURED);
	};

	return (
		<div className="min-h-screen">
			<main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-16">
				<header className="flex flex-col gap-4">
					<p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
						Address Validator
					</p>
					<h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
						Validate and Structure any U.S. address into a clean, structured format.
					</h1>
					<p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
						We will analyze, find missing gaps, and break down the input into normalized fields for downstream systems.
					</p>
				</header>

				<section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
					<Card className="border-border/70">
						<CardHeader>
							<h2 className="text-lg font-semibold">Input</h2>
							<p className="text-sm text-muted-foreground">
								U.S. addresses only. We will analyze the input and break it down into normalized fields.
							</p>
						</CardHeader>
						<CardContent className="flex flex-col gap-4">
							<div className="flex flex-col gap-2">
								<Label htmlFor="address-input">Address</Label>
								<Textarea
									id="address-input"
									value={input}
									onChange={(event) => setInput(event.target.value)}
									placeholder="123 Market St, San Francisco, CA 94105"
								/>
							</div>
						</CardContent>
						<CardFooter className="flex items-center justify-between">
							<Button onClick={handleValidate} disabled={!isValidatable}>
								Validate Address
							</Button>
						</CardFooter>
					</Card>

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
								<Input value={result?.street ?? ""} readOnly />
							</div>
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="grid gap-3">
									<Label>Number</Label>
									<Input value={result?.number ?? ""} readOnly />
								</div>
								<div className="grid gap-3">
									<Label>City</Label>
									<Input value={result?.city ?? ""} readOnly />
								</div>
							</div>
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="grid gap-3">
									<Label>State</Label>
									<Input value={result?.state ?? ""} readOnly />
								</div>
								<div className="grid gap-3">
									<Label>Zip Code</Label>
									<Input value={result?.zipCode ?? ""} readOnly />
								</div>
							</div>
						</CardContent>
					</Card>
				</section>
			</main>
		</div>
	);
}

export default App;
