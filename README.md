# Beast Federated SSO Lab: Keycloak + OpenLDAP + Node.js Web App

This project demonstrates a **Federated SSO (Single Sign-On) Lab** setup using **Keycloak** (Identity Provider) + **OpenLDAP** (user directory) + a **Node.js Web App** (OIDC client).  
It simulates a **real-world enterprise environment** for **Beast Inc.**, enabling centralized authentication for web applications via SSO.

---

## 🚀 Features

**Keycloak** as OIDC Identity Provider  
**OpenLDAP** for user directory (Beast employees)  
**Node.js Web App** integrated via Passport.js  
Seamless Login and Logout with Keycloak  
LDAP user sync into Keycloak  
Secure, responsive web UI (Bootstrap 5)  
Realistic LDAP directory structure

---

## Project Structure

```bash
federated-sso-lab/
├── README.md
├── keycloak/
│ └── keycloak-setup.md
├── ldap/
│ ├── base.ldif
│ ├── users.ldif
│ ├── groups.ldif
│ └── ldap-setup.md
├── mock-app/
│ ├── app.js
│ ├── package.json
│ ├── .env
│ ├── views/
│ │ ├── index.ejs
│ │ └── profile.ejs
│ └── public/
│ └── styles.css (optional)
├── architecture_diagram.png
└── screenshots/
├── keycloak-ui.png
├── ldap-users.png
├── app-login.png
└── app-profile.png
```

---

## 🏗️ Step-by-Step Setup Guide

### 1. Install Prerequisites

All services run on the **same machine (0.0.0.0)**. Install:

| Tool       | Command                                      |
|------------|-----------------------------------------------|
| OpenLDAP   | `sudo apt install slapd ldap-utils`          |
| Node.js    | `sudo apt install nodejs npm`                |
| Keycloak   | Download from [keycloak.org](https://www.keycloak.org/) and extract |

---

### 2. Setup OpenLDAP

#### a) Configure OpenLDAP
```bash
sudo dpkg-reconfigure slapd
```
### Use:

- Domain: beast.local

- Org: Beast Inc.

- Admin DN: cn=admin,dc=beast,dc=local

- Password: beastadminpass

### Add base entries:

```bash
sudo ldapadd -x -D cn=admin,dc=beast,dc=local -W -f ldap/base.ldif
```
### Add users:

```bash
sudo ldapadd -x -D cn=admin,dc=beast,dc=local -W -f ldap/users.ldif
```
### Add groups:

```bash
sudo ldapadd -x -D cn=admin,dc=beast,dc=local -W -f ldap/groups.ldif
```
### Verify:

```bash
ldapsearch -x -H ldap://localhost -b dc=beast,dc=local "(uid=*)"
```

### 3. Setup Keycloak

### a) Run Keycloak

```bash
cd keycloak-26.2.5
export KC_DB=dev-file
export KC_BOOTSTRAP_ADMIN_USER=admin
export KC_BOOTSTRAP_ADMIN_PASSWORD=admin
bin/kc.sh start-dev
```

Access:

```bash
http://0.0.0.0:8080
```

### b) Configure Keycloak Realm

- Create a realm (e.g., Beast_Realm)
- Add LDAP Provider:

	- Vendor: Other

	- Connection URL: ldap://0.0.0.0:389

	- Users DN: ou=users,dc=beast,dc=local

	- Bind DN: cn=admin,dc=beast,dc=local

- Sync users
	- Add mappers (username, email, firstName, lastName)

### c) Add OIDC Client (sample-app)

| Field               | Value                          |
| ------------------- | ------------------------------ |
| Client ID           | `beast-app`                   |
| Access Type         | confidential                   |
| Root URL            | `http://0.0.0.0:3000`          |
| Valid Redirect URIs | `http://0.0.0.0:3000/callback` |
| Web Origins         | `http://0.0.0.0:3000`          |

### 4. Setup Node.js Web App

### a) Install dependencies

```bash
cd mock-app
npm install
```

### b) Configure .env

```bash
KEYCLOAK_ISSUER=http://0.0.0.0:8080/realms/Beast_Realm
KEYCLOAK_AUTH_URL=http://0.0.0.0:8080/realms/Beast_Realm/protocol/openid-connect/auth
KEYCLOAK_TOKEN_URL=http://0.0.0.0:8080/realms/Beast_Realm/protocol/openid-connect/token
KEYCLOAK_USERINFO_URL=http://0.0.0.0:8080/realms/Beast_Realm/protocol/openid-connect/userinfo
KEYCLOAK_CLIENT_ID=sample-app
KEYCLOAK_CLIENT_SECRET=<your-client-secret>
CALLBACK_URL=http://0.0.0.0:3000/callback
KEYCLOAK_LOGOUT_URL=http://0.0.0.0:8080/realms/Beast_Realm/protocol/openid-connect/logout
POST_LOGOUT_REDIRECT_URI=http://0.0.0.0:3000
```

### c) Start the app

```bash
npm start
```

- Visit:

```bash
http://0.0.0.0:3000
```

- Click Login with SSO → Authenticate via Keycloak → Redirects to /profile.

- Click Logout → Fully logged out from both app & Keycloak → Redirected back to /.

### 5. SSO Flow Recap
- User clicks Login → Redirects to Keycloak
- Authenticated via LDAP (e.g., alex.johnson)
- App session created
- User profile displayed
- Logout → Session + Keycloak terminated → Redirects to homepage

### LDAP Sample Users format

| Username     | Password             |
| ------------ | -------------------- |
| alex.johnson | password123          |
| emma.brown   | password123          |
| john.doe     | password123          |
| jane.smith   | password123          |
| ...          | ... (see users.ldif) |

