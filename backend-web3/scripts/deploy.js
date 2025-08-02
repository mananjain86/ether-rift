const hre = require("hardhat");

async function main() {
  console.log("Deploying EtherRift contracts...");

  // Deploy AchievementToken first
  const AchievementToken = await hre.ethers.getContractFactory("AchievementToken");
  const achievementToken = await AchievementToken.deploy("EtherRift Achievement Token", "ERT");
  await achievementToken.waitForDeployment();
  console.log("AchievementToken deployed to:", await achievementToken.getAddress());

  // Deploy EtherRiftCore with the achievement token address
  const EtherRiftCore = await hre.ethers.getContractFactory("EtherRiftCore");
  const etherRiftCore = await EtherRiftCore.deploy(await achievementToken.getAddress());
  await etherRiftCore.waitForDeployment();
  console.log("EtherRiftCore deployed to:", await etherRiftCore.getAddress());

  // Deploy TradingFunctions with the core contract address
  const TradingFunctions = await hre.ethers.getContractFactory("TradingFunctions");
  const tradingFunctions = await TradingFunctions.deploy(await etherRiftCore.getAddress());
  await tradingFunctions.waitForDeployment();
  console.log("TradingFunctions deployed to:", await tradingFunctions.getAddress());

  // Grant MINTER_ROLE to EtherRiftCore
  const MINTER_ROLE = await achievementToken.MINTER_ROLE();
  await achievementToken.grantRole(MINTER_ROLE, await etherRiftCore.getAddress());
  console.log("Granted MINTER_ROLE to EtherRiftCore");

  // Set trading functions address in EtherRiftCore
  await etherRiftCore.setTradingFunctions(await tradingFunctions.getAddress());
  console.log("Set trading functions address in EtherRiftCore");

  console.log("All contracts deployed successfully!");
  console.log("Contract addresses:");
  console.log("- AchievementToken:", await achievementToken.getAddress());
  console.log("- EtherRiftCore:", await etherRiftCore.getAddress());
  console.log("- TradingFunctions:", await tradingFunctions.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 