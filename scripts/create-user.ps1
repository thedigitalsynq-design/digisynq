<#
.SYNOPSIS
    Creates a new Active Directory user inside the Samba AD DC container.

.PARAMETER Username
    The sAMAccountName / username to create.

.PARAMETER Password
    The initial password for the user.

.PARAMETER Group
    Optional Active Directory group to add the user to (e.g., "Domain Admins").

.EXAMPLE
    .\create-user.ps1 -Username "jdoe" -Password "SecurePass123!"
    .\create-user.ps1 -Username "sysadmin" -Password "AdminPass123!" -Group "Domain Admins"
#>

param (
    [Parameter(Mandatory=$true)]
    [string]$Username,

    [Parameter(Mandatory=$true)]
    [string]$Password,

    [Parameter(Mandatory=$false)]
    [string]$Group
)

$ContainerName = "samba-dc"

Write-Host "Checking if container '$ContainerName' is running..." -ForegroundColor Cyan
$status = docker inspect -f '{{.State.Running}}' $ContainerName 2>$null

if ($status -ne "true") {
    Write-Error "Container '$ContainerName' is not running. Start it with 'docker compose up -d' first."
    exit 1
}

Write-Host "Creating user '$Username'..." -ForegroundColor Cyan
docker exec $ContainerName samba-tool user create "$Username" "$Password"

if ($LASTEXITCODE -eq 0) {
    Write-Host "[+] Successfully created user '$Username'!" -ForegroundColor Green

    if ($Group) {
        Write-Host "Adding user '$Username' to group '$Group'..." -ForegroundColor Cyan
        docker exec $ContainerName samba-tool group addmembers "$Group" "$Username"
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[+] Added to group '$Group' successfully!" -ForegroundColor Green
        } else {
            Write-Warning "Failed to add user to group '$Group'."
        }
    }
} else {
    Write-Error "Failed to create user. Check password complexity or if the user already exists."
}
