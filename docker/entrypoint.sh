#!/usr/bin/env bash
set -e

# ==============================================================================
# Samba 4 Active Directory Domain Controller Entrypoint
# ==============================================================================

REALM=${REALM:-CORP.LOCAL}
DOMAIN=${DOMAIN:-CORP}
ADMIN_PASSWORD=${ADMIN_PASSWORD:-P@ssw0rd2026!}
DNS_FORWARDER=${DNS_FORWARDER:-8.8.8.8}
SAMBA_LOG_LEVEL=${SAMBA_LOG_LEVEL:-1}

# Convert REALM and DOMAIN to uppercase for Kerberos/NetBIOS consistency
REALM=$(echo "${REALM}" | tr '[:lower:]' '[:upper:]')
DOMAIN=$(echo "${DOMAIN}" | tr '[:lower:]' '[:upper:]')

echo "========================================================"
echo " Starting Samba Active Directory Domain Controller"
echo " Realm:          ${REALM}"
echo " Domain/NetBIOS: ${DOMAIN}"
echo " DNS Forwarder:  ${DNS_FORWARDER}"
echo "========================================================"

PROVISION_CHECK="/var/lib/samba/private/sam.ldb"

if [ ! -f "${PROVISION_CHECK}" ]; then
    echo "[*] Active Directory database not found at ${PROVISION_CHECK}."
    echo "[*] Initializing new Active Directory Domain Controller..."

    # Ensure any stale configuration files are cleared
    rm -f /etc/samba/smb.conf
    rm -f /etc/krb5.conf

    # Provision Samba AD DC
    samba-tool domain provision \
        --server-role=dc \
        --use-rfc2307 \
        --dns-backend=SAMBA_INTERNAL \
        --realm="${REALM}" \
        --domain="${DOMAIN}" \
        --adminpass="${ADMIN_PASSWORD}" \
        --option="dns forwarder = ${DNS_FORWARDER}" \
        --option="log level = ${SAMBA_LOG_LEVEL}"

    # Setup Kerberos configuration
    if [ -f /var/lib/samba/private/krb5.conf ]; then
        cp /var/lib/samba/private/krb5.conf /etc/krb5.conf
    else
        cat <<EOF > /etc/krb5.conf
[libdefaults]
    default_realm = ${REALM}
    dns_lookup_realm = false
    dns_lookup_kdc = true
EOF
    fi

    # Disable password expiration for default Administrator account (optional for dev/lab setups)
    if [ "${DISABLE_ADMIN_PASSWORD_EXPIRATION:-true}" = "true" ]; then
        echo "[*] Setting Administrator password to never expire..."
        samba-tool user setexpiry Administrator --noexpiry || true
    fi

    # Set password complexity policy if explicitly disabled
    if [ "${DISABLE_PASSWORD_COMPLEXITY:-false}" = "true" ]; then
        echo "[*] Disabling password complexity requirement..."
        samba-tool domain passwordsettings set --complexity=off || true
    fi

    echo "========================================================"
    echo " [+] Domain Controller successfully provisioned!"
    echo " [+] Realm: ${REALM}"
    echo " [+] Administrator username: Administrator"
    echo "========================================================"
else
    echo "[*] Existing Active Directory database found."
    if [ -f /var/lib/samba/private/krb5.conf ] && [ ! -f /etc/krb5.conf ]; then
        cp /var/lib/samba/private/krb5.conf /etc/krb5.conf
    fi
fi

# Ensure DNS resolution inside container points to itself
if [ -n "${REALM}" ]; then
    echo "nameserver 127.0.0.1" > /etc/resolv.conf.dc
    echo "search ${REALM,,}" >> /etc/resolv.conf.dc
    cat /etc/resolv.conf >> /etc/resolv.conf.dc
    # Attempt to replace resolv.conf if permissions allow
    cp /etc/resolv.conf.dc /etc/resolv.conf 2>/dev/null || true
    rm -f /etc/resolv.conf.dc
fi

echo "[*] Launching Samba daemon..."
exec "$@"
