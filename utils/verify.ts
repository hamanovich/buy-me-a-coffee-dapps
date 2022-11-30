import { run } from "hardhat";

export const verify = async (address: string, constructorArguments) => {
  console.log("Verifying contract...");

  try {
    await run("verify:verify", {
      address,
      constructorArguments,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!");
    } else {
      console.log(e);
    }
  }
};
