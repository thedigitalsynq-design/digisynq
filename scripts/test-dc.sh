#!/usr/bin/env bash
set -e

# ==============================================================================
# Helper Script: Test Active Directory Domain Controller Health
# Usage: ./test-dc.sh
# ==============================================================================

CONTAINER_NAME="samba-dc"

echo "========================================================"
echo " Testing Samba Active Directory Domain Controller Health"
echo "========================================================"

# 1. Container status
echo "[1/4] Checking container status..."
if [ "$(docker inspect -f '{{.State.Status}}' "$CONTAINER_NAME" 2>/dev/null)" != "running" ]; then
    echo "[-] Container $CONTAINER_NAME is not running."
    echo "    Run 'docker compose up -d' first."
    exit 1
fi
echo "[+] Container is running!"

# 2. Domain info
echo -e "\n[2/4] Querying Domain Information..."
docker exec "$CONTAINER_NAME" samba-tool domain info 127.0.0.1

# 3. FSMO roles
echo -e "\n[3/4] Querying Active Directory FSMO Roles..."
docker exec "$CONTAINER_NAME" samba-tool fsmo show

# 4. Active Directory users
echo -e "\n[4/4] Listing Active Directory Users..."
docker exec "$CONTAINER_NAME" samba-tool user list

echo -e "\n========================================================"
echo " [+] Health check completed successfully!"
echo "========================================================"
