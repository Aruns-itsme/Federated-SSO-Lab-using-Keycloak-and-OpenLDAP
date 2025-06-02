# OpenLDAP Setup Guide

This guide explains how to set up **OpenLDAP** for the **Federated SSO Lab using Keycloak and OpenLDAP** project.

---

## 🌐 Prerequisites

- Linux machine with `slapd` and `ldap-utils` installed.
- Keycloak running for integration.

---

## 🚀 Step-by-Step OpenLDAP Setup

### 1️. Install OpenLDAP

```bash
sudo apt update
sudo apt install slapd ldap-utils -y
```

Run the configuration wizard:

```bash
sudo dpkg-reconfigure slapd
```

Use these answers:

| Prompt                      | Answer            |
| --------------------------- | ----------------- |
| Omit OpenLDAP server config | No                |
| DNS domain name             | beast.local       |
| Organization name           | Beast             |
| Admin password              | ldapadminpassword |
| Database backend            | MDB               |
| Remove database when purged | No                |
| Move old database           | Yes               |

### 2️. Create Base Structure

Create base.ldif:

```bash
dn: dc=beast,dc=local
objectClass: top
objectClass: dcObject
objectClass: organization
o: Beast
dc: beast

dn: ou=users,dc=beast,dc=local
objectClass: organizationalUnit
ou: users

dn: ou=groups,dc=beast,dc=local
objectClass: organizationalUnit
ou: groups
```

Add the base entries:

```bash
sudo ldapadd -x -D cn=admin,dc=beast,dc=local -W -f base.ldif

```

### 3️. Add Groups

Create groups.ldif:

```bash
dn: cn=developers,ou=groups,dc=beast,dc=local
objectClass: groupOfUniqueNames
cn: developers
uniqueMember: uid=alex.johnson,ou=users,dc=beast,dc=local
......
```


```bash
sudo ldapadd -x -D cn=admin,dc=beast,dc=local -W -f groups.ldif
```

### 4️. Add Users

Create users.ldif:

```bash
dn: uid=alex.johnson,ou=users,dc=beast,dc=local
objectClass: inetOrgPerson
cn: Alex Johnson
sn: Johnson
givenName: Alex
mail: alex.johnson@beast.local
uid: alex.johnson
userPassword: password

... (Add more users similarly)
```

```bash
sudo ldapadd -x -D cn=admin,dc=beast,dc=local -W -f users.ldif
```

### 5️. Test LDAP Entries

```bash
ldapsearch -x -H ldap://localhost -b dc=beast,dc=local
```

### 6️. Keycloak Integration

- In Keycloak → User Federation → Add LDAP Provider.
- Set Connection URL: ldap://0.0.0.0:389
- Set Bind DN: cn=admin,dc=beast,dc=local
- Sync users.

- ## 📑 References

- [OpenLDAP Official Documentation](https://www.openldap.org/doc/)
- [OpenLDAP Admin Guide](https://www.openldap.org/doc/admin24/)
- [LDAP Command-Line Tools](https://linux.die.net/man/1/ldapadd)
- [OpenLDAP GitHub Mirror](https://github.com/openldap/openldap)
