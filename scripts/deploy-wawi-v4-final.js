/**
 * WAWI V4 Token Deployment Script
 * 
 * This script demonstrates the batch minting strategy used to deploy
 * WAWI token with 500B supply and 6 decimals.
 * 
 * Key Features:
 * - Batch minting (10 x 50B) to avoid integer overflow
 * - Token-2022 program for modern Solana standard
 * - Permanent revocation of mint and freeze authorities
 * 
 * Security Note:
 * This is a reference implementation. Private keys are NOT included.
 * Do not commit private keys to public repositories.
 */

import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  createInitializeMint2Instruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  createSetAuthorityInstruction,
  getAssociatedTokenAddress,
  getMint,
  TOKEN_2022_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  AuthorityType,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
} from '@solana/spl-token';
import { readFileSync } from 'fs';

const CONFIG = {
  name: 'WAWI',
  symbol: 'WAWI',
  decimals: 6, // Optimized for large supply (500B)
  totalSupply: 500_000_000_000, // 500 billion
  mintsCount: 10, // Batch minting strategy
  supplyPerMint: 50_000_000_000, // 50 billion per batch
  metadataUri: 'ipfs://bafkreifx3jeyae63pg7w5uzimhpffsvhdhr4vwdocmhrohedtiouq24q3m',
};

async function deployWAWI_V4() {
  console.log('\n🚀 WAWI V4 Token Deployment\n');
  console.log('📊 Configuration:');
  console.log('   Total Supply:', CONFIG.totalSupply.toLocaleString());
  console.log('   Decimals:', CONFIG.decimals);
  console.log('   Batch Strategy:', CONFIG.mintsCount, 'x', CONFIG.supplyPerMint.toLocaleString());
  console.log('   Per Mint:', CONFIG.supplyPerMint.toLocaleString(), 'tokens\n');

  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

  // Load keypairs (paths should be updated for your environment)
  // SECURITY: Never commit private keys to repositories
  const deployerKeypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(readFileSync('./deployer-key.json', 'utf-8')))
  );
  console.log('✅ Deployer:', deployerKeypair.publicKey.toBase58());

  const mintKeypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(readFileSync('./wawi-v4-vanity.json', 'utf-8')))
  );
  console.log('✅ Token Address:', mintKeypair.publicKey.toBase58());

  const balance = await connection.getBalance(deployerKeypair.publicKey);
  console.log('💰 Balance:', (balance / 1e9).toFixed(4), 'SOL\n');

  // Step 1: Create mint account
  console.log('📝 Step 1/4: Creating mint account...');
  const lamports = await getMinimumBalanceForRentExemptMint(connection);
  
  const createMintTx = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: deployerKeypair.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: MINT_SIZE,
      lamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeMint2Instruction(
      mintKeypair.publicKey,
      CONFIG.decimals,
      deployerKeypair.publicKey,
      null,
      TOKEN_2022_PROGRAM_ID
    )
  );

  const sig1 = await sendAndConfirmTransaction(connection, createMintTx, [deployerKeypair, mintKeypair]);
  console.log('✅ Mint created:', sig1);

  // Step 2: Create token account
  console.log('\n📝 Step 2/4: Creating token account...');
  const ata = await getAssociatedTokenAddress(
    mintKeypair.publicKey,
    deployerKeypair.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const createATATx = new Transaction().add(
    createAssociatedTokenAccountInstruction(
      deployerKeypair.publicKey,
      ata,
      deployerKeypair.publicKey,
      mintKeypair.publicKey,
      TOKEN_2022_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
  );

  const sig2 = await sendAndConfirmTransaction(connection, createATATx, [deployerKeypair]);
  console.log('✅ Token account:', ata.toBase58());

  // Step 3: Batch minting to avoid overflow
  console.log('\n📝 Step 3/4: Minting supply in batches...');
  console.log('Strategy: Multiple mints to handle large supply with 6 decimals');
  
  const mintAmountPerBatch = BigInt(CONFIG.supplyPerMint) * (BigInt(10) ** BigInt(CONFIG.decimals));
  console.log('Amount per batch:', mintAmountPerBatch.toString(), 'base units');
  console.log('Expected per batch:', CONFIG.supplyPerMint.toLocaleString(), 'tokens\n');

  for (let i = 1; i <= CONFIG.mintsCount; i++) {
    console.log(`Minting batch ${i}/${CONFIG.mintsCount}...`);
    
    const mintTx = new Transaction().add(
      createMintToInstruction(
        mintKeypair.publicKey,
        ata,
        deployerKeypair.publicKey,
        mintAmountPerBatch,
        [],
        TOKEN_2022_PROGRAM_ID
      )
    );

    const sig = await sendAndConfirmTransaction(connection, mintTx, [deployerKeypair]);
    console.log(`✅ Batch ${i} completed:`, sig.slice(0, 20) + '...');
    
    // Rate limiting protection
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n✅ All batches minted successfully!');

  // Step 4: Revoke authorities (critical for security)
  console.log('\n📝 Step 4/4: REVOKING AUTHORITIES...');
  const revokeTx = new Transaction().add(
    createSetAuthorityInstruction(
      mintKeypair.publicKey,
      deployerKeypair.publicKey,
      AuthorityType.MintTokens,
      null,
      [],
      TOKEN_2022_PROGRAM_ID
    )
  );

  const sig4 = await sendAndConfirmTransaction(connection, revokeTx, [deployerKeypair]);
  console.log('✅ MINT AUTHORITY REVOKED - Supply is now immutable');

  // Final verification
  const mintInfo = await getMint(connection, mintKeypair.publicKey, 'confirmed', TOKEN_2022_PROGRAM_ID);
  const finalSupply = Number(mintInfo.supply) / (10 ** CONFIG.decimals);

  console.log('\n=====================================');
  console.log('🎉 WAWI V4 DEPLOYED SUCCESSFULLY!');
  console.log('=====================================\n');
  console.log('Token Address:', mintKeypair.publicKey.toBase58());
  console.log('Actual Supply:', finalSupply.toLocaleString(), 'tokens');
  console.log('Expected Supply:', CONFIG.totalSupply.toLocaleString(), 'tokens');
  console.log('Match:', finalSupply === CONFIG.totalSupply ? '✅ PERFECT' : '⚠️ Mismatch');
  console.log('Decimals:', CONFIG.decimals);
  console.log('Mint Authority:', mintInfo.mintAuthority ? '❌ Active' : '✅ REVOKED');
  console.log('Freeze Authority:', mintInfo.freezeAuthority ? '❌ Active' : '✅ DISABLED');
  console.log('\n🔗 Verification:');
  console.log('Solscan:', 'https://solscan.io/token/' + mintKeypair.publicKey.toBase58());
  console.log('RugCheck:', 'https://rugcheck.xyz/tokens/' + mintKeypair.publicKey.toBase58());
  console.log('\n✅ Token is production-ready\n');
}

// Export for use as module
export { deployWAWI_V4, CONFIG };

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  deployWAWI_V4().catch(console.error);
}
