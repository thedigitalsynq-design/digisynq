<#
.SYNOPSIS
    Starts the Jenkins container using docker-compose.jenkins.yml.
#>

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " Starting Jenkins CI/CD on Docker" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

# Check if docker is available
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Docker is not found in PATH. Please make sure Docker Desktop is installed and running."
    exit 1
}

Write-Host "[*] Launching Jenkins container..." -ForegroundColor Yellow
docker compose -f docker-compose.jenkins.yml up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "[+] Jenkins started successfully!" -ForegroundColor Green
    Write-Host "[*] Jenkins Web UI: http://localhost:8080" -ForegroundColor Cyan
    Write-Host "[*] To get initial admin password, run:" -ForegroundColor Yellow
    Write-Host "    .\scripts\get-jenkins-password.ps1" -ForegroundColor White
} else {
    Write-Error "Failed to start Jenkins container."
}
