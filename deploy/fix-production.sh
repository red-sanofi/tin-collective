#!/usr/bin/env sh
# Backward-compatible alias for deploy/production.sh
exec "$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)/production.sh" "$@"
