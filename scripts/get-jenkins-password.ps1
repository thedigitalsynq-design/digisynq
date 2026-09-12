<#
.SYNOPSIS
    Retrieves the initial administrator password for Jenkins.
#>

param (
    [string]$ContainerName = "jenkins"
)

Write-Host "Retrieving Jenkins Initial Admin Password..." -ForegroundColor Cyan

# Check container state
$status = docker inspect -f '{{.State.Status}}' $ContainerName 2>$null

if ($status -ne "running") {
    Write-Host "[-] Jenkins container is not running (Current status: $status)." -ForegroundColor Red
    Write-Host "    Run '.\scripts\run-jenkins.ps1' to start Jenkins first."
    exit 1
}

$password = docker exec $ContainerName cat /var/jenkins_home/secrets/initialAdminPassword 2>$null

if ($password) {
    Write-Host "`n========================================================" -ForegroundColor Green
    Write-Host " Jenkins Initial Admin Password:" -ForegroundColor Green
    Write-Host " $password" -ForegroundColor Yellow
    Write-Host "========================================================" -ForegroundColor Green
    Write-Host "`nOpen http://localhost:8080 in your browser and paste this password." -ForegroundColor Cyan
} else {
    Write-Host "[-] Password file not found yet. Jenkins might still be initializing. Wait 10 seconds and try again." -ForegroundColor Yellow
}
