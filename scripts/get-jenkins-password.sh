#!/usr/bin/env bash
set -e

CONTAINER_NAME="jenkins"

if [ "$(docker inspect -f '{{.State.Status}}' "$CONTAINER_NAME" 2>/dev/null)" != "running" ]; then
    echo "[-] Jenkins container is not running. Run './scripts/run-jenkins.sh' first."
    exit 1
fi

PASSWORD=$(docker exec "$CONTAINER_NAME" cat /var/jenkins_home/secrets/initialAdminPassword 2>/dev/null || true)

if [ -n "$PASSWORD" ]; then
    echo "========================================================"
    echo " Jenkins Initial Admin Password:"
    echo " $PASSWORD"
    echo "========================================================"
    echo "Open http://localhost:8080 and paste this password."
else
    echo "[-] Password file not found yet. Jenkins might still be initializing. Wait a few seconds and try again."
fi
