# Keycloak Setup Guide

This guide walks through setting up **Keycloak** for the **Federated SSO Lab using Keycloak and OpenLDAP** project. Keycloak will act as the Identity Provider (IdP) for Single Sign-On (SSO).

---

## Prerequisites

- A machine (Linux/Windows) with:
  - Java 17+ installed
  - Keycloak 26.2.5+ downloaded
- LDAP server (e.g., OpenLDAP) running on `0.0.0.0`
- Internet access

---

## Step-by-Step Keycloak Setup

### 1️. Download and Extract Keycloak

```bash
wget https://github.com/keycloak/keycloak/releases/download/26.2.5/keycloak-26.2.5.tar.gz
tar -xvzf keycloak-26.2.5.tar.gz
cd keycloak-26.2.5
```

### 2. Set Environment Variables

```bash
export KC_DB=dev-file
export KC_FEATURES=preview
export KC_HTTP_RELATIVE_PATH=/auth
export KC_HOSTNAME=0.0.0.0
export KC_HTTP_PORT=8080
export KC_LOG_LEVEL=info
export KC_PROXY=edge
export KC_BOOTSTRAP_ADMIN_USER=admin
export KC_BOOTSTRAP_ADMIN_PASSWORD=admin
```
### 3️. Start Keycloak

```bash
bin/kc.sh start-dev
```

Keycloak should be accessible at:

```bash
http://0.0.0.0:8080/
```

### 4️. Create a Realm

- Login to the Keycloak Admin Console (http://0.0.0.0:8080/).
- Click "Create Realm".
- Name it test_realm.
- Save.

### 5️. Configure LDAP as User Federation

- Navigate to User Federation → Add Provider → ldap.

- Configure:

  - Vendor: Other

  - Connection URL: ldap://0.0.0.0:389

  - Users DN: ou=users,dc=beast,dc=local

  - Bind DN: cn=admin,dc=beast,dc=local

  - Bind Credential: ldapadminpassword

- Click Test Connection.

- Click Test Authentication.

- Click Save.

### 6️. Create a Client (OIDC App)

- Go to Clients → Create Client.

Name: sample-app

- Client Protocol: openid-connect

- Valid Redirect URIs:

```bash
http://0.0.0.0:3000/*
```

- Web Origins:

```bash
http://0.0.0.0:3000
```

- Enable:

  - Standard Flow

- Disable:

  - Direct Access Grants

- Save.

### 7.  Sync LDAP Users

- Navigate to User Federation → LDAP Provider.
- Click Synchronize all users.

### 8️. Test Authentication

- Visit: http://0.0.0.0:3000
- Click Login with SSO.
- You should be redirected to Keycloak login page.
- Authenticate and get redirected to the app.

### 9. Admin Tasks

- Configure user attributes mapping.
- Create groups and roles as needed.
- Set up client scopes for additional claims.

### References

## 📑 References

- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [Keycloak LDAP User Federation](https://www.keycloak.org/docs/latest/server_admin/#_ldap)
- [Keycloak OpenID Connect Documentation](https://www.keycloak.org/docs/latest/securing_apps/index.html#openid-connect)
- [Keycloak GitHub Repository](https://github.com/keycloak/keycloak)
