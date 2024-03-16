import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Halscion", () => {

    // Fixture
    async function startContract() {
        const [owner, account2, account3] = await ethers.getSigners();
        const Halscion = await ethers.getContractFactory("Halscion");
        const cHalscion = await Halscion.deploy(100);
        return { cHalscion, owner, account2, account3 };
    }

    it("should deploy", async () => {
        const { cHalscion, owner } = await loadFixture(startContract);
        const balance = await cHalscion.balanceOf(owner.address);
        expect(balance).to.be.eq("100");
        expect(cHalscion).not.to.be.undefined;
    });

    it("should be able to stake", async () => {
        const { cHalscion, owner } = await loadFixture(startContract);
        expect(await cHalscion.balanceOf(owner.address)).to.be.eq("100");
        await cHalscion.stake(60);
        expect(await cHalscion.balanceOf(owner.address)).to.be.eq("40");
        expect(await cHalscion.balanceOf(cHalscion.getAddress())).to.be.eq("60");
    });

    it("should be able to get current rewards", async () => {
        const { cHalscion, owner } = await loadFixture(startContract);
        await cHalscion.stake(60);

        // Fast forward time by 1 hour
        const elapsedTime = (await time.latest()) + (60*60);
        await time.increaseTo(elapsedTime);
        const rewardAmount = await cHalscion.getCurrentReward(owner.address);

        expect(rewardAmount).to.be.greaterThan(0);
        console.log("Current Reward Amount: ", rewardAmount);
    });

    it("should be able to withdraw", async () => {
        const { cHalscion, owner } = await loadFixture(startContract);
        await cHalscion.stake(60);

        // Fast forward time by 1 hour
        const elapsedTime = (await time.latest()) + (60*60);
        await time.increaseTo(elapsedTime);

        await cHalscion.withdraw();

        const balance = await cHalscion.balanceOf(owner.address);
        expect(balance).to.be.greaterThan("100");
        console.log(balance);
    });

})