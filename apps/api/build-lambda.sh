#!/usr/bin/env bash
set -euo pipefail

APP_NAME="api"
APP_DIR="apps/$APP_NAME"
DIST_DIR="$APP_DIR/dist"
OUT_DIR="$DIST_DIR/lambda"

cd "$(git rev-parse --show-toplevel)"

echo "→ Building NestJS app"
pnpm --filter "$APP_NAME" build

echo "→ Cleaning previous bundle"
rm -rf "$OUT_DIR"

echo "→ Bundling Lambda with ncc"
pnpm dlx @vercel/ncc build "$DIST_DIR/lambda.js" -o "$OUT_DIR"

echo "✓ Lambda bundle ready at $OUT_DIR/index.js"
