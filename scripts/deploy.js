const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying PayChain contract...");

  const PayChain = await ethers.getContractFactory("PayChain");
  const paychain = await PayChain.deploy();

  await paychain.waitForDeployment();

  const address = await paychain.getAddress();
  console.log(`✅ PayChain deployed to: ${address}`);
  console.log("Copy this address — you'll need it for the frontend.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});