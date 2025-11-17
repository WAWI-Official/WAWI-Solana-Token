# WAWI Prime V5 Deployment Scripts

Complete set of scripts used for WAWI Prime (V5) token deployment on Solana blockchain.

---

## 📋 Available Scripts

### 1. `deploy-v5-mint.js`
**Purpose:** Mint 500 billion WAWI Prime tokens using batch strategy

**Why batch minting?**
Token-2022 has precision constraints when handling large supplies (>100B tokens) with high decimal precision. Batch minting in 10 × 50B chunks avoids integer overflow issues.

**Usage:**
```bash
# Set wallet path as environment variable (recommended)
export WALLET_PATH=/path/to/your/deployer-keypair.json

# Run minting script
node scripts/deploy-v5-mint.js
```

**What it does:**
- Mints 10 batches of 50,000,000,000 tokens each
- Verifies final supply accuracy (100.000000%)
- Provides transaction signatures for audit trail
- Confirms each batch before proceeding

**Prerequisites:**
- Solana CLI v1.18.4+
- spl-token CLI v3.3.0+
- Token already created with Token-2022 program
- Mint authority not yet revoked
- Sufficient SOL for transaction fees

---

### 2. `deploy-v5-metadata.js`
**Purpose:** Document on-chain metadata setup for Token-2022

**About Token-2022 Metadata:**
- Stores name, symbol, and URI directly on-chain
- Enables instant indexation by explorers (hours vs days)
- Metadata is immutable once set
- Must be initialized during token creation

**Usage:**
```bash
node scripts/deploy-v5-metadata.js
```

**Note:** This script serves as documentation. WAWI Prime metadata was set during initial token creation. The script verifies and displays current metadata configuration.

**Metadata Location:**
- On-chain: Token-2022 extensions
- Full JSON: `metadata/wawi-v5-metadata.json`
- GitHub: https://github.com/WAWI-Official/WAWI-Solana-Token

---

### 3. `airdrop-v1-to-prime.js`
**Purpose:** Migrate V1 token holders to WAWI Prime at 27.78x ratio

**Migration Details:**
- Ratio: 500B / 18B = 27.777777778
- V1 holders: 4 founding community members
- Total distributed: 53,036,959 WAWI Prime
- Transfer fees: Compensated by team
- Date: November 14, 2025

**Usage:**
```bash
# Update V1_HOLDERS array with actual holder data
# Verify AIRDROP_RATIO calculation
node scripts/airdrop-v1-to-prime.js
```

**What it does:**
- Calculates exact Prime amount per V1 holder
- Verifies sufficient balance before sending
- Executes transfers with confirmation
- Generates detailed JSON report
- Provides transaction signatures

**Safety features:**
- Balance verification before execution
- Transaction confirmation per holder
- Complete audit trail
- Failure handling (stops on error)

---

## 🔧 Prerequisites

### Required Software
```bash
# Solana CLI
solana --version  # Should be 1.18.4+

# SPL Token CLI
spl-token --version  # Should be 3.3.0+

# Node.js
node --version  # Should be 16+

# NPM packages
npm install @solana/web3.js @solana/spl-token
```

### Wallet Setup
```bash
# NEVER commit your wallet keypair to Git!
# Add to .gitignore:
echo "*-keypair.json" >> .gitignore
echo "deployer-key.json" >> .gitignore

# Use environment variable (recommended)
export WALLET_PATH=/secure/path/to/wallet.json

# Or place in scripts directory (ensure .gitignore)
cp /path/to/wallet.json ./scripts/deployer-keypair.json
```

---

## 🔒 Security Best Practices

### DO ✅
- Use environment variables for sensitive paths
- Keep wallet keypairs outside Git repository
- Verify transactions on Solscan before proceeding
- Test on devnet first with small amounts
- Backup wallet keypairs securely
- Use hardware wallets for production

### DON'T ❌
- Never commit wallet keypairs to GitHub
- Never share private keys
- Never run untrusted scripts with production wallets
- Never skip transaction verification
- Never use mainnet for testing

---

## 📊 Token Specifications

**WAWI Prime (V5)**
```
Address:        wawi1i4SohUJmnrgMokDtUpRPB3fcYkfM5Z1LcacuC7
Standard:       Token-2022 (SPL)
Supply:         500,000,000,000 (immutable)
Decimals:       6
Transfer Fee:   1%
Mint Authority: Revoked
Freeze Auth:    Disabled
Metadata:       On-chain
```

**Verify on:**
- Solscan: https://solscan.io/token/wawi1i4SohUJmnrgMokDtUpRPB3fcYkfM5Z1LcacuC7

---

## 🎯 Deployment Timeline

**November 7, 2025:** V4 created (manual metadata)
**November 14, 2025:** V5 (WAWI Prime) deployed
- ✅ On-chain metadata set
- ✅ 500B tokens minted (10 batches)
- ✅ 400B sent to multisig treasury
- ✅ V1 holders migrated (4 holders, 53M tokens)
- ✅ V4 burned (500B tokens)
- ✅ Mint authority revoked

---

## 📖 Documentation

### Complete Documentation
- [Token Development History](../TOKEN_DEVELOPMENT.md)
- [Treasury Management](../TREASURY.md)
- [Security Policy](../SECURITY.md)
- [Launch Record](../WAWI_PRIME_LAUNCH_RECORD.md)

### Metadata
- [V5 Metadata JSON](../metadata/wawi-v5-metadata.json)

### Official Links
- Website: https://wawi.digital
- Twitter: https://x.com/WAWI_Official
- Telegram: https://t.me/WAWI_Official
- Discord: https://discord.gg/tBAHUFNVkQ

---

## 🤝 Contributing

These scripts are provided for:
- Educational purposes
- Transparency and verification
- Community learning
- Future project reference

**License:** MIT

Feel free to:
- Study the code
- Adapt for your projects
- Share learnings
- Report issues

---

## ⚠️ Disclaimer

**IMPORTANT:**

These scripts interact with Solana mainnet and real funds. Use with caution:

1. **Test first:** Always test on devnet with test tokens
2. **Verify:** Double-check all addresses and amounts
3. **Backup:** Keep wallet backups in multiple secure locations
4. **Understand:** Know what each script does before running
5. **Security:** Never share private keys or seed phrases

**The scripts are provided "as is" without warranty. Use at your own risk.**

---

## 📞 Support

For questions about WAWI deployment:
- GitHub Issues: https://github.com/WAWI-Official/WAWI-Solana-Token/issues
- Telegram: https://t.me/WAWI_Official
- Discord: https://discord.gg/tBAHUFNVkQ

---

**Built Different. Built Right.**

*From Innovation to Impact.*
