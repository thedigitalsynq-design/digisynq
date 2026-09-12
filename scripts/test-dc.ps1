<#
.SYNOPSIS
    Tests health and status of the Active Directory Domain Controller container.
#>

param (
    [string]$ContainerName = "samba-dc"
)

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " Testing Samba Active Directory Domain Controller Health" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

# 1. Check container state
Write-Host "[1/4] Checking container status..." -ForegroundColor Yellow
$status = docker inspect -f '{{.State.Status}}' $ContainerName 2>$null

if ($status -ne "running") {
    Write-Host "[-] Container '$ContainerName' is not running (Current status: $status)." -ForegroundColor Red
    Write-Host "    Run 'docker compose up -d' to start the container."
    exit 1
}
Write-Host "[+] Container is running!" -ForegroundColor Green

# 2. Query Domain Info
Write-Host "`n[2/4] Querying Domain Information..." -ForegroundColor Yellow
docker exec $ContainerName samba-tool domain info 127.0.0.1

# 3. Query FSMO Roles
Write-Host "`n[3/4] Querying Active Directory FSMO Roles..." -ForegroundColor Yellow
docker exec $ContainerName samba-tool fsmo show

# 4. List Active Directory Users
Write-Host "`n[4/4] Listing Active Directory Users..." -ForegroundColor Yellow
docker exec $ContainerName samba-tool user list

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host " [+] All checks completed successfully!" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
