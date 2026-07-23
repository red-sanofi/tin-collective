#!/usr/bin/env sh
# Shared curl helpers for deploy scripts.
# Avoid "000000" when curl prints 000 and also hits the || fallback.

http_code() {
  url="$1"
  timeout="${2:-12}"
  code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time "$timeout" "$url" 2>/dev/null || true)"
  case "$code" in
    [0-9][0-9][0-9]) printf '%s' "$code" ;;
    *) printf '000' ;;
  esac
}

http_code_with_headers() {
  url="$1"
  timeout="${2:-12}"
  shift 2
  code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time "$timeout" "$@" "$url" 2>/dev/null || true)"
  case "$code" in
    [0-9][0-9][0-9]) printf '%s' "$code" ;;
    *) printf '000' ;;
  esac
}

header_value() {
  url="$1"
  header_name="$2"
  timeout="${3:-12}"
  shift 3
  curl -sSI --max-time "$timeout" "$@" "$url" 2>/dev/null \
    | tr -d '\r' \
    | awk -F': ' -v key="$header_name" 'tolower($1)==tolower(key) {print $2; exit}'
}

body_contains() {
  url="$1"
  needle="$2"
  timeout="${3:-12}"
  curl -sS --max-time "$timeout" "$url" 2>/dev/null | grep -q "$needle"
}

resolve_host() {
  host="$1"
  if command -v getent >/dev/null 2>&1; then
    getent ahosts "$host" 2>/dev/null | awk 'NR==1 {print $1; exit}'
    return
  fi
  if command -v dig >/dev/null 2>&1; then
    dig +short "$host" A 2>/dev/null | awk 'NR==1 {print; exit}'
    return
  fi
  printf 'unknown'
}
