import { ethers } from "hardhat";

interface Memo {
  from: string;
  timestamp: number;
  name: string;
  message: string;
}

async function getBalance(address: string) {
  const balanceBigInt = await ethers.provider.getBalance(address);
  return ethers.utils.formatEther(balanceBigInt);
}

async function printBalances(addresses: string[]) {
  for (const [index, address] of addresses.entries()) {
    console.log(`Address ${index} balance: ${await getBalance(address)}`);
  }
}

async function printMemos(memos: Memo[]) {
  for (const memo of memos) {
    const { timestamp, name, from, message } = memo;
    console.log(`At ${timestamp}, ${name} (${from}) said: "${message}"`);
  }
}

async function main() {
  const [owner, addr1, addr2, addr3] = await ethers.getSigners();
  const Contract = await ethers.getContractFactory("BuyMeACoffee");
  const contract = await Contract.deploy();
  await contract.deployed();

  console.log(`BuyMeACoffee deployed to ${contract.address}`);

  const addresses = [owner.address, addr1.address, contract.address];
  console.log("___start___");
  await printBalances(addresses);

  const tip = { value: ethers.utils.parseEther("1") };
  await contract.connect(addr1).buyCoffee("Max", "Message #1", tip);
  await contract.connect(addr2).buyCoffee("Kate", "Message #2", tip);
  await contract.connect(addr3).buyCoffee("Tim", "Message #3", tip);

  console.log("___in_between___");
  await printBalances(addresses);

  await contract.connect(owner).withdrawTips();

  console.log("___after___");
  await printBalances(addresses);

  console.log("___memos___");
  const memos = await contract.getMemos();
  printMemos(memos);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
