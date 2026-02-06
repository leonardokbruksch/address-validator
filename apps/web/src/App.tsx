import { useState } from "react";
import { InputCard } from "@/components/InputCard";
import { ResultCard } from "@/components/ResultCard";
import { ADDRESS_STATUS, type StructuredAddress } from "./types/address";

export default function App() {
	const [input, setInput] = useState<string | undefined>(undefined);
	const [result, setResult] = useState<StructuredAddress | undefined>(undefined);
	const [loading, setLoading] = useState(false);

	const handleValidate = () => {
		setResult(undefined);
		setLoading(true);

		const apiUrl = import.meta.env.API_URL || "http://localhost:3000";
		fetch(`${apiUrl}/validate-address`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ address: input }),
		})
			.then((res) => res.json())
			.then((data: StructuredAddress) => {
				setResult(data);
				setLoading(false);

			})
			.catch((err) => {
				console.error("Error validating address:", err);
				setLoading(false);
				setResult({ status: ADDRESS_STATUS.UNVERIFIABLE });
			});
	};

	return (
		<div className="min-h-screen">
			<main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-16">
				<header className="flex flex-col gap-4">
					<p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
						Address Validator
					</p>
					<h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
						Validate and standardize U.S. addresses into a clean, structured format.
					</h1>
					<p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
						Accepts free-form address input and returns normalized address components,
						indicating whether the result is valid, corrected, or unverifiable.
					</p>
				</header>

				<section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
					<InputCard
						input={input}
						onInputChange={setInput}
						onValidate={handleValidate}
						isLoading={loading}
					/>
					<ResultCard result={result} loading={loading} />
				</section>
			</main>
		</div>
	);
}
