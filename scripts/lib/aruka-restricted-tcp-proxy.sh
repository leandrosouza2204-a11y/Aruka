#!/bin/sh
set -eu

case "${TARGET_IP:-}" in
  *[!0-9.]*|'') exit 64 ;;
esac
case "${TARGET_PORT:-}" in
  *[!0-9]*|'') exit 64 ;;
esac

exec nc "$TARGET_IP" "$TARGET_PORT"
