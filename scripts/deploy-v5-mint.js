/**
 * WAWI Prime V5 - Batch Minting Script
 * 
 * Purpose: Mint 500,000,000,000 WAWI Prime tokens using batch strategy
 * Blockchain: Solana (Token-2022)
 * Strategy: 10 batches of 50,000,000,000 tokens each
 * 
 * Why batch minting?
 * Token-2022 has precision limits when handling large supplies (>100B)
 * combined with high decimal precision. Batch minting avoids overflow.
 * 
 * Prerequisites:
 * - Solana CLI installed (v1.18.4+)
 * - spl-token CLI installed (v3.3.0+)
 * - Deployer wallet with sufficient SOL for rent and fees
 * - Token already created with Token-2022 program
 * 
 * Usage:
 * 1. Update CONFIGURATION section below
 * 2. Run: node scripts/deploy-v5-mint.js
 * 3. Verify final supply matches 500,000,000,000 exactly
 */

const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const { TOKEN_2022_PROGRAM_ID, getMint, mintTo } = require('@solana/spl-token');
const fs = require('fs');

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  // RPC endpoint (use your own RPC for production)
  rpcUrl: 'https://api.mainnet-beta.solana.com',
  
  // Path to your deployer wallet keypair
  // SECURITY: Never commit your actual wallet file to GitHub!
  walletPath: process.env.WALLET_PATH || './deployer-keypair.json',
  
  // WAWI Prime token mint address
  tokenMint: 'wawi1i4SohUJmnrgMokDtUpRPB3fcYkfM5Z1LcacuC7',
  
  // Target supply and batch configuration
  targetSupply: 500_000_000_000, // 500 billion
  decimals: 6,
  batchCount: 10,
  tokensPerBatch: 50_000_000_000 // 50 billion per batch
};

// ============================================
// BATCH MINTING FUNCTION
// ============================================

async function batchMintTokens() {
  console.log('🚀 WAWI Prime V5 - Batch Minting');
  console.log('='.repeat(60));
  console.log(`Target Supply: ${CONFIG.targetSupply.toLocaleString()}`);
  console.log(`Batch Count: ${CONFIG.batchCount}`);
  console.log(`Tokens per Batch: ${CONFIG.tokensPerBatch.toLocaleString()}`);
  console.log('='.repeat(60));
  console.log('');

  // Load wallet
  console.log('📂 Loading wallet...');
  if (!fs.existsSync(CONFIG.walletPath)) {
    throw new Error(`Wallet file not found: ${CONFIG.walletPath}`);
  }
  
  const walletKeypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(CONFIG.walletPath, 'utf-8')))
  );
  console.log(`✅ Wallet loaded: ${walletKeypair.publicKey.toBase58()}`);
  console.log('');

  // Connect to Solana
  console.log('🌐 Connecting to Solana...');
  const connection = new Connection(CONFIG.rpcUrl, 'confirmed');
  console.log('✅ Connected');
  console.log('');

  // Get mint account
  const mintPubkey = new PublicKey(CONFIG.tokenMint);
  const mintInfo = await getMint(
    connection,
    mintPubkey,
    'confirmed',
    TOKEN_2022_PROGRAM_ID
  );

  console.log('📊 Current Mint Info:');
  console.log(`  Decimals: ${mintInfo.decimals}`);
  console.log(`  Supply: ${mintInfo.supply.toString()}`);
  console.log(`  Mint Authority: ${mintInfo.mintAuthority?.toBase58() || 'null'}`);
  console.log('');

  // Verify mint authority
  if (!mintInfo.mintAuthority) {
    throw new Error('❌ Mint authority is already revoked! Cannot mint.');
  }

  if (mintInfo.mintAuthority.toBase58() !== walletKeypair.publicKey.toBase58()) {
    throw new Error('❌ Wallet is not the mint authority!');
  }

  // Get destination token account
  const { getAssociatedTokenAddress } = require('@solana/spl-token');
  const destinationAccount = await getAssociatedTokenAddress(
    mintPubkey,
    walletKeypair.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID
  );

  console.log(`📍 Destination Account: ${destinationAccount.toBase58()}`);
  console.log('');

  // Calculate token amounts (in smallest units)
  const tokensPerBatchRaw = BigInt(CONFIG.tokensPerBatch) * BigInt(10 ** CONFIG.decimals);

  // Execute batch minting
  console.log('⚙️  Starting Batch Minting...');
  console.log('-'.repeat(60));

  const results = [];

  for (let i = 1; i <= CONFIG.batchCount; i++) {
    try {
      console.log(`\n🔄 Batch ${i}/${CONFIG.batchCount}`);
      console.log(`   Minting: ${CONFIG.tokensPerBatch.toLocaleString()} tokens`);

      const signature = await mintTo(
        connection,
        walletKeypair,
        mintPubkey,
        destinationAccount,
        walletKeypair,
        tokensPerBatchRaw,
        [],
        { skipPreflight: false },
        TOKEN_2022_PROGRAM_ID
      );

      console.log(`   ⏳ Confirming transaction...`);
      await connection.confirmTransaction(signature, 'confirmed');

      console.log(`   ✅ Success!`);
      console.log(`   📝 Signature: ${signature}`);
      console.log(`   🔗 https://solscan.io/tx/${signature}`);

      results.push({
        batch: i,
        amount: CONFIG.tokensPerBatch,
        signature,
        success: true
      });

    } catch (error) {
      console.error(`   ❌ Batch ${i} failed: ${error.message}`);
      results.push({
        batch: i,
        amount: CONFIG.tokensPerBatch,
        signature: null,
        success: false,
        error: error.message
      });
      break; // Stop on first failure
    }
  }

  // Verify final supply
  console.log('\n');
  console.log('='.repeat(60));
  console.log('📊 VERIFICATION');
  console.log('='.repeat(60));

  const finalMintInfo = await getMint(
    connection,
    mintPubkey,
    'confirmed',
    TOKEN_2022_PROGRAM_ID
  );

  const finalSupply = Number(finalMintInfo.supply) / (10 ** CONFIG.decimals);
  const targetSupply = CONFIG.targetSupply;
  const accuracy = (finalSupply / targetSupply) * 100;

  console.log(`\nTarget Supply: ${targetSupply.toLocaleString()}`);
  console.log(`Final Supply:  ${finalSupply.toLocaleString()}`);
  console.log(`Accuracy:      ${accuracy.toFixed(9)}%`);

  if (finalSupply === targetSupply) {
    console.log('\n✅ PERFECT! Supply matches target exactly.');
  } else {
    console.log(`\n⚠️  Supply difference: ${(finalSupply - targetSupply).toLocaleString()}`);
  }

  // Summary
  console.log('\n');
  console.log('='.repeat(60));
  console.log('📋 SUMMARY');
  console.log('='.repeat(60));

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`\nTotal Batches: ${results.length}`);
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);

  if (failed === 0) {
    console.log('\n🎉 ALL BATCHES COMPLETED SUCCESSFULLY!');
    console.log('\n⚠️  IMPORTANT: Revoke mint authority after verification!');
    console.log('Command: spl-token authorize <TOKEN> mint --disable');
  }

  return results;
}

// ============================================
// EXECUTE
// ============================================

if (require.main === module) {
  batchMintTokens()
    .then(() => {
      console.log('\n✅ Minting complete.');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ FATAL ERROR:', error);
      process.exit(1);
    });
}

module.exports = { batchMintTokens };
