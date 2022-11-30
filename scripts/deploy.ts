import { network, ethers } from "hardhat";
import { developmentChains } from "../helper-hardhat-config";
import { verify } from "../utils/verify";

async function main() {
  const Contract = await ethers.getContractFactory("BuyMeACoffee");
  const contract = await Contract.deploy();
  await contract.deployed();
  console.log(`BuyMeACoffee deployed to ${contract.address}`);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    console.log("Verifying...");
    await verify(contract.address, arguments);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
