#!/usr/bin/env bash
set -e

# ==============================================================================
# Helper Script: Start Jenkins on Docker
# ==============================================================================

echo "========================================================"
echo " Starting Jenkins CI/CD on Docker"
echo "========================================================"

docker compose -f docker-compose.jenkins.yml up -d

echo "[+] Jenkins started successfully!"
echo "[*] Web UI: http://localhost:8080"
echo "[*] To get initial password, run: ./scripts/get-jenkins-password.sh"
