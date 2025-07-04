const { ethers } = require('hardhat');

async function main() {
  console.log('🌱 Deploying JijiFresh Smart Contracts to Lisk...');

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log('Deploying with account:', deployer.address);
  console.log('Account balance:', (await deployer.getBalance()).toString());

  // Deploy USDT mock token for testing (in production, use real USDT)
  console.log('\n📄 Deploying Mock USDT...');
  const MockUSDT = await ethers.getContractFactory('MockUSDT');
  const usdt = await MockUSDT.deploy();
  await usdt.deployed();
  console.log('Mock USDT deployed to:', usdt.address);

  // Deploy JijiFresh Marketplace
  console.log('\n🏪 Deploying JijiFresh Marketplace...');
  const JijiFreshMarketplace = await ethers.getContractFactory('JijiFreshMarketplace');
  const marketplace = await JijiFreshMarketplace.deploy(usdt.address);
  await marketplace.deployed();
  console.log('JijiFresh Marketplace deployed to:', marketplace.address);

  // Mint some USDT for testing
  console.log('\n💰 Minting test USDT...');
  await usdt.mint(deployer.address, ethers.utils.parseUnits('10000', 6)); // 10,000 USDT
  console.log('Minted 10,000 USDT to deployer');

  // Verify deployment
  console.log('\n✅ Deployment Summary:');
  console.log('='.repeat(50));
  console.log('Mock USDT Address:', usdt.address);
  console.log('Marketplace Address:', marketplace.address);
  console.log('Deployer Address:', deployer.address);
  console.log('Network:', (await ethers.provider.getNetwork()).name);
  
  // Save deployment info
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    mockUSDT: usdt.address,
    marketplace: marketplace.address,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber()
  };

  const fs = require('fs');
  fs.writeFileSync(
    'deployment-info.json',
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log('\n📝 Deployment info saved to deployment-info.json');
  
  // Instructions for WhatsApp bot integration
  console.log('\n🤖 WhatsApp Bot Integration:');
  console.log('='.repeat(50));
  console.log('1. Update your .env file with:');
  console.log(`   SMART_CONTRACT_ADDRESS=${marketplace.address}`);
  console.log(`   USDT_TOKEN_ADDRESS=${usdt.address}`);
  console.log('2. Fund the bot wallet with USDT for payouts');
  console.log('3. Register the bot as an admin in the contract');
  console.log('4. Start the WhatsApp bot: npm run start');
  
  console.log('\n🎉 JijiFresh is ready to revolutionize Nigerian commerce!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });