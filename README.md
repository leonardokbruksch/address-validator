# Address Validator

A take-home interview project that implements a simple address validation flow end-to-end:

- `apps/web`: React + Vite UI for submitting an address and viewing results
- `apps/api`: NestJS API with a single validation endpoint and unit tests
- Monorepo managed with `pnpm` workspaces

## Architecture

```
[Web UI] -> POST /validate-address -> [NestJS API] -> [AddressProvider] -> [Nominatim]
```

- The API validates requests and responses at runtime using Zod schemas (`nestjs-zod` DTOs).
- Address lookups currently use the Nominatim public API through a provider interface, so a different provider can be swapped in later with minimal surface changes.

## Running Locally

Prereqs:

- Node.js
- `pnpm`

Install dependencies:

```bash
pnpm install
```

Run the web app and API together:

```bash
pnpm dev
```

Run the API only:

```bash
pnpm dev:api
```

Run the web app only:

```bash
pnpm dev:web
```

Run API unit tests:

```bash
pnpm --filter api test
```

## Address Provider Choice (Nominatim)

I selected the Nominatim public API (OpenStreetMap) as the initial provider because it is free, does not require an API key, and is sufficient for a take-home assessment. Nominatim can also be self-hosted in the cloud if a team wants a fully self-managed setup.

Other viable options include Google Maps API (commercial, strong coverage and data quality), USPS (US-centric), Smarty/USPS-powered services, and other paid providers.

Tradeoffs for Nominatim:

- ✅ Free and no API key required
- ✅ OpenStreetMap ecosystem with an option to run a self-managed instance
- ⚠️ Rate limits and potential availability constraints on the public endpoint
- ⚠️ Data quality and normalization may be less consistent than paid providers

The provider is accessed through an `AddressProvider` interface, so swapping providers later is a small, contained change.

## Validation Logic (Explicit)

The API returns a structured address plus a status. The status is computed with the following rules:

If:
- No address found => `UNVERIFIABLE`
- Multiple addresses found => `UNVERIFIABLE`
- Address is incomplete (missing any of street, number, city, state, zip) => `UNVERIFIABLE`

If:
- Address matches the input exactly => `VALID`

If:
- Address found but corrected or additional info was added => `CORRECTED`

## API

- Endpoint: `POST /validate-address`
- Request body:

```json
{
  "address": "1600 Amphitheatre Pkwy, Mountain View, CA 94043"
}
```

- Response body (example):

```json
{
  "street": "Amphitheatre Parkway",
  "number": "1600",
  "city": "Mountain View",
  "state": "California",
  "zipCode": "94043",
  "status": "CORRECTED"
}
```

If the lookup fails or returns an incomplete result, the API returns:

```json
{ "status": "UNVERIFIABLE" }
```

## Configuration

- The web app defaults to `http://localhost:3000` for the API.
- You can override this by setting `API_URL` at build time (e.g. in the Vite environment).

## Repository Structure

- `apps/web`: React + Vite UI
- `apps/api`: NestJS API, schemas, providers, and unit tests

## Future Improvements

- Add caching and request throttling to reduce dependency on upstream rate limits
- Support additional providers (USPS, Smarty, Google, etc.) via the provider interface
- Expand validation semantics (e.g., Avenue vs Av, N vs North)
- Add e2e tests that hit Nominatim's API
- Add Nominatim locally as a docker image. Replace their public API with a managed one.

## Tools And AI Usage

- Languages/Frameworks: TypeScript, NestJS (API), React + Vite (web), Zod (runtime validation)
- Tools: `pnpm` workspaces, Jest for unit tests
- AI usage: Used Codex/ChatGPT to draft and refine README content and clarify decision/tradeoff wording.

## Technologies Used

- 🧠 Language: TypeScript
- 🏗️ Backend: NestJS
- 🧪 Validation: Zod (runtime schemas + DTOs)
- ✅ Testing: Jest (unit tests)
- 🖥️ Frontend: React + Vite
- 🎨 Styling: Tailwind CSS
- 📦 Monorepo: `pnpm` workspaces
