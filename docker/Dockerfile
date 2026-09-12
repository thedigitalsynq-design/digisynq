FROM ubuntu:22.04

LABEL maintainer="Active Directory in Docker"
LABEL description="Containerized Active Directory Domain Controller based on Samba 4"

# Prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Update system and install Samba AD DC, Kerberos, DNS & LDAP utilities
RUN apt-get update && apt-get install -y --no-install-recommends \
    samba \
    samba-dsdb-modules \
    samba-vfs-modules \
    winbind \
    libnss-winbind \
    libpam-winbind \
    krb5-user \
    krb5-config \
    dnsutils \
    bind9-host \
    ldap-utils \
    smbclient \
    ca-certificates \
    curl \
    iproute2 \
    procps \
    dos2unix \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Remove default smb.conf so domain provisioning can run cleanly
RUN rm -f /etc/samba/smb.conf /etc/krb5.conf

# Setup directory structure
RUN mkdir -p /var/lib/samba /etc/samba /var/log/samba /var/run/samba

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN dos2unix /entrypoint.sh && chmod +x /entrypoint.sh

# Active Directory default ports:
# DNS: 53 (TCP/UDP)
# Kerberos: 88, 464 (TCP/UDP)
# RPC Endpoint Mapper: 135 (TCP)
# NetBIOS: 137, 138 (UDP), 139 (TCP)
# LDAP/LDAPS: 389 (TCP/UDP), 636 (TCP)
# SMB: 445 (TCP)
# Global Catalog: 3268, 3269 (TCP)
EXPOSE 53/tcp 53/udp \
       88/tcp 88/udp \
       135/tcp \
       137/udp 138/udp \
       139/tcp \
       389/tcp 389/udp \
       445/tcp \
       464/tcp 464/udp \
       636/tcp \
       3268/tcp \
       3269/tcp

VOLUME ["/var/lib/samba", "/etc/samba", "/var/log/samba"]

ENTRYPOINT ["/entrypoint.sh"]
CMD ["samba", "-i", "-M", "single"]
