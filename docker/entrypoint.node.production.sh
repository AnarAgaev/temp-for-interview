#!/bin/sh

set -e

npm install

echo "Production mode"
SHELL=/bin/sh exec npm run build
