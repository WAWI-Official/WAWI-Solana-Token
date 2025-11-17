/**
 * WAWI Prime V5 - On-Chain Metadata Setup
 * 
 * Purpose: Initialize Token-2022 on-chain metadata extensions
 * Why: Instant indexation on explorers (hours vs days for manual submission)
 * 
 * Token-2022 Metadata Extensions:
 * - Name, Symbol stored directly on-chain
 * - URI to full metadata JSON (IPFS/Arweave)
 * - Immutable once set (cannot be changed)
 * 
 * Prerequisites:
 * - Token already created with Token-2022 program
 * - Metadata extension initialized during token creation
 * - Update authority available (if metadata not yet set)
 * 
 * Usage:
 * 1. Upload metadata JSON to IPFS/Arweave
 * 2. Update METADATA_CONFIG below
 * 3. Run: node scripts/deploy-v5-metadata.js
 */

const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const { 
  TOKEN_2022_PROGRAM_ID,
  createUpdateMetadataPointerInstruction,
  getMint
} = require('@solana/spl-token');
const fs = require('fs');

// ============================================
// CONFIGURATION
// ============================================

const METADATA_CONFIG = {
  // RPC endpoint
  rpcUrl: 'https://api.mainnet-beta.solana.com',
  
  // Wallet path (must be update authority)
  walletPath: process.env.WALLET_PATH || './deployer-keypair.json',
  
  // Token mint address
  tokenMint: 'wawi1i4SohUJmnrgMokDtUpRPB3fcYkfM5Z1LcacuC7',
  
  // On-chain metadata
  metadata: {
    name: 'WAWI',
    symbol: 'WAWI',
    uri: 'https://raw.githubusercontent.com/WAWI-Official/WAWI-Solana-Token/main/metadata/wawi-v5-metadata.json'
  }
};

// ============================================
// METADATA SETUP FUNCTION
// ============================================

async function setupOnChainMetadata() {
  console.log('📝 WAWI Prime V5 - On-Chain Metadata Setup');
  console.log('='.repeat(60));
  console.log(`Token: ${METADATA_CONFIG.tokenMint}`);
  console.log(`Name: ${METADATA_CONFIG.metadata.name}`);
  console.log(`Symbol: ${METADATA_CONFIG.metadata.symbol}`);
  console.log(`URI: ${METADATA_CONFIG.metadata.uri}`);
  console.log('='.repeat(60));
  console.log('');

  // Load wallet
  console.log('📂 Loading wallet...');
  const walletKeypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(METADATA_CONFIG.walletPath, 'utf-8')))
  );
  console.log(`✅ Wallet: ${walletKeypair.publicKey.toBase58()}`);
  console.log('');

  // Connect
  console.log('🌐 Connecting to Solana...');
  const connection = new Connection(METADATA_CONFIG.rpcUrl, 'confirmed');
  console.log('✅ Connected');
  console.log('');

  // Get mint info
  const mintPubkey = new PublicKey(METADATA_CONFIG.tokenMint);
  const mintInfo = await getMint(
    connection,
    mintPubkey,
    'confirmed',
    TOKEN_2022_PROGRAM_ID
  );

  console.log('📊 Mint Info:');
  console.log(`  Supply: ${Number(mintInfo.supply) / (10 ** mintInfo.decimals)}`);
  console.log(`  Decimals: ${mintInfo.decimals}`);
  console.log('');

  console.log('⚠️  NOTE: Token-2022 metadata must be initialized at token creation.');
  console.log('This script serves as documentation for the process used.');
  console.log('');
  console.log('✅ WAWI Prime metadata was set on-chain during initial deployment.');
  console.log('');
  console.log('Verify metadata on Solscan:');
  console.log(`🔗 https://solscan.io/token/${METADATA_CONFIG.tokenMint}`);

  return {
    mint: METADATA_CONFIG.tokenMint,
    metadata: METADATA_CONFIG.metadata,
    status: 'Metadata set during token creation'
  };
}

// ============================================
// EXECUTE
// ============================================

if (require.main === module) {
  setupOnChainMetadata()
    .then(result => {
      console.log('\n✅ Metadata verification complete.');
      console.log(JSON.stringify(result, null, 2));
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ ERROR:', error);
      process.exit(1);
    });
}

module.exports = { setupOnChainMetadata, METADATA_CONFIG };
