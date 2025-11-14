# WAWI Security Overview

## Multi-Signature Treasury Protection

**WAWI treasury is secured by 3-of-5 multi-signature wallet:**

- **Protocol:** Squads v4 (audited and battle-tested)
- **Treasury Address:** `Fyze5hpkVbQpa1P7SCokLJntGbBk12yUWUDWPbzoNKim`
- **Configuration:** Requires 3 of 5 signatures for any transaction
- **Holdings:** Ready for V5 token allocation

[View Treasury on Solscan](https://solscan.io/account/Fyze5hpkVbQpa1P7SCokLJntGbBk12yUWUDWPbzoNKim)

**Security Benefits:**
- No single point of failure
- Protected against key theft or loss
- Transparent on-chain governance
- Industry-standard protection
- Cannot be moved without multiple approvals

For detailed governance information, see [TREASURY.md](TREASURY.md)

---

# Security Policy

## Supported Versions

Only the current production version (WAWI Prime) is supported and maintained.

| Version | Status | Support |
|---------|--------|---------|
| V5 - WAWI Prime (wawi1i4S...) | Current | Full support |
| V4 (wawi1dR9...) | Deprecated - Burned | No support |
| V3 (wawix88...) | Deprecated - Burned | No support |
| V2 (wawiKXYY...) | Deprecated - Burned | No support |
| V1 (2WKpoGYz...) | Deprecated | No support |

**All previous versions (V2, V3, V4) have been completely burned.**

Verify burns on Solana incinerator: [1nc1nerator11111111111111111111111111111111](https://solscan.io/account/1nc1nerator11111111111111111111111111111111)

---

## Reporting a Vulnerability

If you discover a security vulnerability, please follow responsible disclosure:

### Private Disclosure (Preferred)

**For critical issues that could affect users:**

1. **Email:** security@wawi.digital
2. **Include:**
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)

3. **Response time:** Within 48 hours
4. **Resolution:** Coordinated disclosure after fix

### Public Disclosure

**For non-critical issues:**

- Open GitHub Issue with label `security`
- Discuss in Discord: https://discord.gg/tBAHUFNVkQ

---

## Security Measures

### Token Security (WAWI Prime)
- Mint authority permanently revoked
- Freeze authority permanently disabled
- On-chain metadata (Token-2022 extensions)
- Vanity address (wawi1) for authentication
- Supply immutable (500,000,000,000)
- 1% transfer fee (sustainable funding mechanism)

### Repository Security
- Private keys excluded via .gitignore
- 2FA required for maintainers
- Code review for all commits
- Verified domain ownership

---

## Safe Usage Guidelines

### For Users
1. Always verify token address starts with `wawi1i4S`
2. Check supply is exactly 500,000,000,000
3. Confirm authorities are null on Solscan
4. Use official links only
5. Full address: `wawi1i4SohUJmnrgMokDtUpRPB3fcYkfM5Z1LcacuC7`

### For Developers
1. Never commit private keys
2. Review .gitignore before commits
3. Test on devnet before mainnet suggestions
4. Follow secure coding practices

---

## Security Contacts

- **General:** security@wawi.digital
- **X:** @WAWI_Official
- **Discord:** https://discord.gg/tBAHUFNVkQ

---

## Bug Bounty

Currently no formal bug bounty program. 

Responsible disclosure appreciated and acknowledged in:
- GitHub repository
- Project documentation
- Social media recognition

---

**Last Updated:** November 2025
