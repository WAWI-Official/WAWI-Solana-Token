# Security Policy

## Supported Versions

Only the current production version (V4) is supported and maintained.

| Version | Status | Support |
|---------|--------|---------|
| V4 (wawi1...) | ✅ Current | Full support |
| V3 (wawix88...) | ❌ Deprecated | No support |
| V2 (wawiKXYY...) | ❌ Deprecated | No support |
| V1 (2WKpoGYz...) | ❌ Deprecated | No support |

## Reporting a Vulnerability

If you discover a security vulnerability, please follow responsible disclosure:

### 🔒 Private Disclosure (Preferred)

**For critical issues that could affect users:**

1. **Email:** security@wawi.digital
2. **Include:**
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)

3. **Response time:** Within 48 hours
4. **Resolution:** Coordinated disclosure after fix

### 📢 Public Disclosure

**For non-critical issues:**

- Open GitHub Issue with label `security`
- Discuss in Discord: https://discord.gg/tBAHUFNVkQ

## Security Measures

### Token Security
- ✅ Mint authority permanently revoked
- ✅ Freeze authority permanently disabled
- ✅ Vanity address (wawi1) for authentication
- ✅ Supply immutable (500,000,000,000)

### Repository Security
- ✅ Private keys excluded via .gitignore
- ✅ 2FA required for maintainers
- ✅ Code review for all commits
- ✅ Verified domain ownership

## Safe Usage Guidelines

### For Users
1. Always verify token address starts with `wawi1`
2. Check supply is exactly 500,000,000,000
3. Confirm authorities are null on Solscan
4. Use official links only

### For Developers
1. Never commit private keys
2. Review .gitignore before commits
3. Test on devnet before mainnet suggestions
4. Follow secure coding practices

## Security Contacts

- **General:** security@wawi.digital
- **X:** @WAWI_Official
- **Discord:** https://discord.gg/tBAHUFNVkQ

## Bug Bounty

Currently no formal bug bounty program. 

Responsible disclosure appreciated and acknowledged in:
- GitHub repository
- Project documentation
- Social media recognition

---

**Last Updated:** November 2025
