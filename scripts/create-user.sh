#!/usr/bin/env bash
set -e

# ==============================================================================
# Helper Script: Create Active Directory User
# Usage: ./create-user.sh <username> <password> [group]
# ==============================================================================

CONTAINER_NAME="samba-dc"
USERNAME="$1"
PASSWORD="$2"
GROUP="$3"

if [ -z "$USERNAME" ] || [ -z "$PASSWORD" ]; then
    echo "Usage: $0 <username> <password> [group]"
    echo "Example: $0 jdoe 'P@ssw0rd2026!' 'Domain Admins'"
    exit 1
fi

if [ "$(docker inspect -f '{{.State.Running}}' "$CONTAINER_NAME" 2>/dev/null)" != "true" ]; then
    echo "[!] Container $CONTAINER_NAME is not running. Start it with 'docker compose up -d' first."
    exit 1
fi

echo "[*] Creating user: $USERNAME"
docker exec "$CONTAINER_NAME" samba-tool user create "$USERNAME" "$PASSWORD"

if [ -n "$GROUP" ]; then
    echo "[*] Adding user $USERNAME to group $GROUP"
    docker exec "$CONTAINER_NAME" samba-tool group addmembers "$GROUP" "$USERNAME"
fi

echo "[+] Successfully provisioned user $USERNAME!"
