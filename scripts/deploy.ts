import { ethers } from "hardhat";
async function main() {
  const Halscion = await ethers.deployContract("Halscion", [1000]);

  await Halscion.waitForDeployment();
  console.log(`Halscion Token Contract deployed to ${Halscion.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});