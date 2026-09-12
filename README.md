# Docker Active Directory Domain Controller (Samba 4 AD DC)

[![Docker CI](https://github.com/actions/workflows/docker-build.yml/badge.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#)

A fully containerized, production-ready **Active Directory Domain Controller (AD DC)** powered by Samba 4, running seamlessly in Docker.

It provides complete Active Directory services compatible with Windows 10/11 and Linux clients:
- **Kerberos v5** authentication (SSO, ticket granting)
- **LDAP / LDAPS** directory service (ports 389 / 636)
- **Built-in AD DNS server** with dynamic record updates
- **SMB / CIFS** file sharing and Group Policy Object (GPO) distribution
- **Remote Server Administration Tools (RSAT)** compatibility (Active Directory Users & Computers, Group Policy Management, DNS Manager)
- **Automated Domain Provisioning** on first start with persistent volume storage

---

## 📁 Repository Structure

```
.
├── .github/
│   └── workflows/
│       └── docker-build.yml     # Automated CI build & health check on GitHub Actions
├── docker/
│   ├── Dockerfile               # Ubuntu 22.04 + Samba 4 AD DC image definition
│   └── entrypoint.sh            # Automated provisioning & bootstrap script
├── scripts/
│   ├── create-user.ps1          # PowerShell helper to create AD users and assign groups
│   ├── create-user.sh           # Bash helper to create AD users and assign groups
│   ├── test-dc.ps1              # PowerShell health check (domain info, FSMO, user list)
│   ├── test-dc.sh               # Bash health check
│   ├── run-jenkins.ps1          # PowerShell script to start Jenkins CI/CD container
│   ├── run-jenkins.sh           # Bash script to start Jenkins CI/CD container
│   ├── get-jenkins-password.ps1 # PowerShell script to retrieve Jenkins initial password
│   └── get-jenkins-password.sh  # Bash script to retrieve Jenkins initial password
├── .env.example                 # Configuration template for domain settings
├── .gitignore                   # Excludes credentials and local runtime files
├── docker-compose.yml           # Samba AD DC container definition
├── docker-compose.jenkins.yml   # Jenkins LTS CI/CD container definition
└── README.md                    # Documentation and usage guide
```

---

## 🚀 Quick Start

### 1. Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows / macOS) or Docker Engine + Docker Compose (Linux)
- Git

### 2. Configure Domain Settings
Clone this repository and create your environment file:

```bash
cp .env.example .env
```

Edit `.env` to customize your domain parameters:

```ini
REALM=DIGISYNQ.COM
DOMAIN=DIGISYNQ
ADMIN_PASSWORD=YourStrongP@ssw0rd!
DNS_FORWARDER=8.8.8.8
SAMBA_LOG_LEVEL=1
```

> [!IMPORTANT]
> The `ADMIN_PASSWORD` must satisfy Active Directory complexity rules (minimum 8 characters, containing uppercase, lowercase, numbers, and symbols).

### 3. Launch the Domain Controller

```bash
docker compose up -d
```

### 4. Monitor Initialization
Follow the startup logs to see domain provisioning in action:

```bash
docker compose logs -f
```

You should see:
```text
========================================================
 [+] Domain Controller successfully provisioned!
 [+] Realm: DIGISYNQ.COM
 [+] Administrator username: Administrator
========================================================
```

---

## 🔍 Verifying Domain Health

Run the included verification scripts:

**On Windows (PowerShell):**
```powershell
.\scripts\test-dc.ps1
```

**On Linux / macOS:**
```bash
chmod +x scripts/*.sh
./scripts/test-dc.sh
```

Or query directly using `docker exec`:
```bash
# Check domain status & functional level
docker exec -it samba-dc samba-tool domain info 127.0.0.1

# View FSMO roles
docker exec -it samba-dc samba-tool fsmo show

# List all users
docker exec -it samba-dc samba-tool user list
```

---

## 👥 User & Group Management

### Create a New User
You can create users using the included scripts:

**PowerShell:**
```powershell
.\scripts\create-user.ps1 -Username "alice" -Password "UserPass2026!" -Group "Domain Admins"
```

**Bash:**
```bash
./scripts/create-user.sh alice "UserPass2026!" "Domain Admins"
```

**Direct `samba-tool` Command:**
```bash
docker exec -it samba-dc samba-tool user create username "Password123!"
docker exec -it samba-dc samba-tool group addmembers "Domain Admins" username
```

---

## 🏗️ Jenkins CI/CD on Docker

A dedicated Jenkins LTS container service is configured and ready to run:

### Start Jenkins:
**PowerShell:**
```powershell
.\scripts\run-jenkins.ps1
```

**Bash:**
```bash
./scripts/run-jenkins.sh
```

Or using Docker Compose directly:
```bash
docker compose -f docker-compose.jenkins.yml up -d
```

### Retrieve Initial Admin Password:
**PowerShell:**
```powershell
.\scripts\get-jenkins-password.ps1
```

**Bash:**
```bash
./scripts/get-jenkins-password.sh
```

### Access Jenkins Web UI:
Open **[http://localhost:8080](http://localhost:8080)** in your browser and paste the password to complete setup.

---

## 🖥️ Connecting Windows Clients & RSAT

### 1. Set Client DNS
On your client machine (Windows or Linux):
1. Open Network Adapter Properties.
2. Set the **Primary DNS Server** to the **IP address of the Docker host machine**.
3. Verify name resolution:
   ```powershell
   nslookup digisynq.com
   nslookup -type=SRV _ldap._tcp.dc._msdcs.digisynq.com
   ```

### 2. Join the Windows Machine to the Domain
1. Press `Win + R`, type `sysdm.cpl`, and press **Enter**.
2. Click **Change...** under the Computer Name tab.
3. Under **Member of**, select **Domain** and enter your realm (e.g., `DIGISYNQ.COM`).
4. When prompted, authenticate with:
   - **Username**: `Administrator`
   - **Password**: Your `ADMIN_PASSWORD` defined in `.env`
5. Restart your computer when prompted.

### 3. Remote Administration (RSAT)
Install **Remote Server Administration Tools (RSAT)** on your Windows client:
- Go to **Settings > System > Optional features > Add an optional feature**.
- Search for and install:
  - **RSAT: Active Directory Domain Services and Lightweight Directory Services Tools**
  - **RSAT: Group Policy Management Tools**
  - **RSAT: DNS Server Tools**
- Launch `dsa.msc` (**Active Directory Users and Computers**) and connect to `dc1.digisynq.com`!

---

## 🌐 Port Mappings Reference

| Port | Protocol | Service | Description |
| :--- | :--- | :--- | :--- |
| **53** | TCP / UDP | DNS | Active Directory integrated DNS |
| **88** | TCP / UDP | Kerberos | Authentication service (KDC) |
| **135** | TCP | RPC | Endpoint Mapper |
| **137-138** | UDP | NetBIOS | Name service and datagrams |
| **139** | TCP | NetBIOS | Session service |
| **389** | TCP / UDP | LDAP | Directory Service |
| **445** | TCP | SMB / CIFS | SYSVOL, Netlogon & File shares |
| **464** | TCP / UDP | kpasswd | Kerberos password change |
| **636** | TCP | LDAPS | LDAP over SSL |
| **3268-3269** | TCP | Global Catalog | LDAP / LDAPS Global Catalog query |

---

## 📦 Backup & Persistence

All domain databases, sysvol policies, and Kerberos keys persist inside named Docker volumes:
- `samba_data`: Contains `/var/lib/samba` (SAM database, secrets, SYSVOL shares)
- `samba_etc`: Contains `/etc/samba` (`smb.conf`)
- `samba_log`: Contains `/var/log/samba`

### Create an Offline Backup:
```bash
docker exec -it samba-dc samba-tool domain backup online --targetdir=/var/lib/samba/backup
```

---

## 🐙 Push to GitHub

To push this repository to your GitHub account:

```bash
# 1. Initialize local Git repository (if not already done)
git init

# 2. Add and commit all files
git add .
git commit -m "feat: initial commit of Docker Active Directory Domain Controller"

# 3. Rename branch to main
git branch -M main

# 4. Link your remote repository (replace with your repo URL)
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# 5. Push to GitHub
git push -u origin main
```

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
