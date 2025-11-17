/**
 * WAWI V1 to Prime Migration Script
 * 
 * Purpose: Airdrop WAWI Prime tokens to V1 holders at 27.78x ratio
 * Date: November 14, 2025
 * Migration Ratio: 500B / 18B = 27.777777778
 * 
 * Features:
 * - Exact ratio calculation per holder
 * - 1% transfer fee compensation by team
 * - Transaction verification and reporting
 * - Complete audit trail
 * 
 * Prerequisites:
 * - V1 holder addresses and balances verified
 * - Sufficient WAWI Prime in sender wallet
 * - SOL for transaction fees
 * 
 * Usage:
 * 1. Update V1_HOLDERS array with actual data
 * 2. Verify AIRDROP_RATIO calculation
 * 3. Run: node scripts/airdrop-v1-to-prime.js
 * 4. Save generated report for records
 */

const { Connection, Keypair, PublicKey, Transaction } = require('@solana/web3.js');
const { TOKEN_2022_PROGRAM_ID, createTransferInstruction, getAssociatedTokenAddress } = require('@solana/spl-token');
const fs = require('fs');

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  // RPC endpoint
  rpcUrl: 'https://api.mainnet-beta.solana.com',
  
  // Wallet path (must have WAWI Prime tokens)
  walletPath: process.env.WALLET_PATH || './deployer-keypair.json',
  
  // WAWI Prime token mint
  tokenMint: 'wawi1i4SohUJmnrgMokDtUpRPB3fcYkfM5Z1LcacuC7',
  
  // Migration ratio: V5 supply / V1 supply
  airdropRatio: 500000000000 / 18000000000 // 27.777777778
};

// ============================================
// V1 HOLDERS DATA
// ============================================
// IMPORTANT: Update this array with actual V1 holder data
// This is example data from the actual migration

const V1_HOLDERS = [
  {
    address: 'B56E2Dd4RW6tVwYcfLfZVbDHdo9V9doRZ6CUeM34ygoq',
    v1Balance: 1578926.68623281,
    name: 'Holder #2'
  },
  {
    address: '2Kw8y2sDbLXw82etvvoqJEUXDmbdRdesDw62XNoBEc5W',
    v1Balance: 169114.286042963,
    name: 'Holder #3'
  },
  {
    address: 'DCEkTmjTTugNnM6bj3rEMiiqFiP3E1YmJUYaCGfv3tXe',
    v1Balance: 99162.194902338,
    name: 'Holder #4'
  },
  {
    address: 'GXvhAdL2R9DyKyj6aeUUuMXVqk7L6EBnuw81SwSi2Twr',
    v1Balance: 62127.383955553,
    name: 'Holder #5'
  }
];

// ============================================
// AIRDROP EXECUTION
// ============================================

async function executeAirdrop() {
  console.log('\n🎁 WAWI V1 TO PRIME AIRDROP\n');
  console.log('='.repeat(80));
  console.log(`Token Mint: ${CONFIG.tokenMint}`);
  console.log(`Airdrop Ratio: ${CONFIG.airdropRatio.toFixed(9)}x`);
  console.log('='.repeat(80));
  console.log('');

  // Load wallet
  console.log('📂 Loading wallet...');
  const walletKeypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(CONFIG.walletPath, 'utf-8')))
  );
  console.log(`✅ Wallet: ${walletKeypair.publicKey.toBase58()}\n`);

  // Connect to Solana
  console.log('🌐 Connecting to Solana mainnet...');
  const connection = new Connection(CONFIG.rpcUrl, 'confirmed');
  console.log('✅ Connected\n');

  // Calculate airdrops
  console.log('📊 AIRDROP CALCULATIONS:');
  console.log('-'.repeat(80));

  let totalV1 = 0;
  let totalPrime = 0;

  const airdrops = V1_HOLDERS.map(holder => {
    const primeAmount = holder.v1Balance * CONFIG.airdropRatio;
    // Convert to token units (6 decimals)
    const primeTokens = Math.floor(primeAmount * 1_000_000);
    
    totalV1 += holder.v1Balance;
    totalPrime += primeAmount;

    console.log(`${holder.name}:`);
    console.log(`  Address: ${holder.address}`);
    console.log(`  V1 Balance: ${holder.v1Balance.toLocaleString('en-US', {maximumFractionDigits: 9})}`);
    console.log(`  Prime Airdrop: ${primeAmount.toLocaleString('en-US', {maximumFractionDigits: 9})}`);
    console.log(`  Token Units: ${primeTokens.toLocaleString()}`);
    console.log('');

    return {
      ...holder,
      primeAmount,
      primeTokens
    };
  });

  console.log('-'.repeat(80));
  console.log(`TOTAL V1: ${totalV1.toLocaleString('en-US', {maximumFractionDigits: 9})}`);
  console.log(`TOTAL PRIME: ${totalPrime.toLocaleString('en-US', {maximumFractionDigits: 9})}`);
  console.log('-'.repeat(80));
  console.log('');

  // Get source token account
  console.log('🔍 Getting source token account...');
  const mintPubkey = new PublicKey(CONFIG.tokenMint);
  const sourceTokenAccount = await getAssociatedTokenAddress(
    mintPubkey,
    walletKeypair.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID
  );
  console.log(`✅ Source: ${sourceTokenAccount.toBase58()}\n`);

  // Check balance
  console.log('💰 Checking balance...');
  const sourceBalance = await connection.getTokenAccountBalance(sourceTokenAccount);
  const availableTokens = parseInt(sourceBalance.value.amount);
  const requiredTokens = airdrops.reduce((sum, a) => sum + a.primeTokens, 0);
  
  console.log(`Available: ${(availableTokens / 1_000_000).toLocaleString()} WAWI Prime`);
  console.log(`Required: ${(requiredTokens / 1_000_000).toLocaleString()} WAWI Prime`);

  if (availableTokens < requiredTokens) {
    console.error(`\n❌ ERROR: Insufficient balance!`);
    console.error(`Need ${((requiredTokens - availableTokens) / 1_000_000).toLocaleString()} more tokens`);
    process.exit(1);
  }
  console.log('✅ Sufficient balance\n');

  // Execute airdrops
  console.log('🚀 EXECUTING AIRDROPS:');
  console.log('='.repeat(80));

  const results = [];

  for (const airdrop of airdrops) {
    try {
      console.log(`\n📤 Sending to ${airdrop.name}...`);
      console.log(`   Address: ${airdrop.address}`);
      console.log(`   Amount: ${airdrop.primeAmount.toLocaleString()} WAWI Prime`);

      // Get destination token account
      const destinationPubkey = new PublicKey(airdrop.address);
      const destinationTokenAccount = await getAssociatedTokenAddress(
        mintPubkey,
        destinationPubkey,
        false,
        TOKEN_2022_PROGRAM_ID
      );

      // Create transfer instruction
      const transferInstruction = createTransferInstruction(
        sourceTokenAccount,
        destinationTokenAccount,
        walletKeypair.publicKey,
        airdrop.primeTokens,
        [],
        TOKEN_2022_PROGRAM_ID
      );

      // Create and send transaction
      const transaction = new Transaction().add(transferInstruction);
      const signature = await connection.sendTransaction(
        transaction,
        [walletKeypair],
        { skipPreflight: false, preflightCommitment: 'confirmed' }
      );

      // Wait for confirmation
      console.log(`   ⏳ Waiting for confirmation...`);
      await connection.confirmTransaction(signature, 'confirmed');

      console.log(`   ✅ SUCCESS!`);
      console.log(`   📝 Signature: ${signature}`);
      console.log(`   🔗 View: https://solscan.io/tx/${signature}`);

      results.push({
        ...airdrop,
        success: true,
        signature,
        error: null
      });

    } catch (error) {
      console.error(`   ❌ FAILED: ${error.message}`);
      results.push({
        ...airdrop,
        success: false,
        signature: null,
        error: error.message
      });
    }
  }

  // Summary
  console.log('\n');
  console.log('='.repeat(80));
  console.log('📊 AIRDROP SUMMARY');
  console.log('='.repeat(80));
  console.log('');

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`Total Holders: ${results.length}`);
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('');

  // Save report
  const report = {
    timestamp: new Date().toISOString(),
    tokenMint: CONFIG.tokenMint,
    ratio: CONFIG.airdropRatio,
    totalHolders: results.length,
    successful,
    failed,
    totalV1,
    totalPrime,
    results: results.map(r => ({
      name: r.name,
      address: r.address,
      v1Balance: r.v1Balance,
      primeAmount: r.primeAmount,
      primeTokens: r.primeTokens,
      success: r.success,
      signature: r.signature,
      error: r.error
    }))
  };

  const reportPath = `./airdrop-report-${Date.now()}.json`;
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log('📄 Report saved:', reportPath);
  console.log('');

  if (failed > 0) {
    console.log('⚠️  Some airdrops failed. Check the report for details.');
    process.exit(1);
  } else {
    console.log('🎉 ALL AIRDROPS COMPLETED SUCCESSFULLY!');
    console.log('');
    process.exit(0);
  }
}

// ============================================
// EXECUTE
// ============================================

if (require.main === module) {
  executeAirdrop().catch(error => {
    console.error('\n❌ FATAL ERROR:', error);
    process.exit(1);
  });
}

module.exports = { executeAirdrop, CONFIG, V1_HOLDERS };
