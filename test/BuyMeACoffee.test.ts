import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BuyMeACoffee } from "../typechain-types/BuyMeACoffee";

describe("BuyMeACoffee", () => {
  async function deployBuyMeACoffeeFixture() {
    const BuyMeACoffee = await ethers.getContractFactory("BuyMeACoffee");
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();

    const contract = (await BuyMeACoffee.deploy()) as BuyMeACoffee;

    await contract.deployed();

    return { BuyMeACoffee, contract, owner, addr1, addr2, addr3 };
  }

  describe("Deployment", () => {
    it("Should calculate contract balance", async () => {
      const { contract, addr1, addr2 } = await loadFixture(
        deployBuyMeACoffeeFixture
      );

      const tip = { value: ethers.utils.parseEther("1") };
      await contract.connect(addr1).buyCoffee("Max", "Message #1", tip);
      await contract.connect(addr2).buyCoffee("Tim", "Message #2", tip);
      const contractBalance = await contract.getBalance();
      expect(contractBalance).to.equal(ethers.utils.parseEther("2"));
    });
  });
});
