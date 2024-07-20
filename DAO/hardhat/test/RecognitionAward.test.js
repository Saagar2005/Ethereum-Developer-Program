const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("RecogAward Test", function () {
  async function deployAwardFixture() {
    const [admin, other] = await ethers.getSigners();

    const Award = await ethers.getContractFactory("RecognitionAward");
    const award = await Award.deploy([]);

    return { award, admin, other };
  }

  it("Should set the right admin on deployment", async function () {
    const { award, admin } = await loadFixture(deployAwardFixture);

    expect(award.deploymentTransaction().from).to.equal(admin.address);
  });

  it("Should issue the award (by admin)", async function () {
    const { award } = await loadFixture(deployAwardFixture);

    await expect(award.issue(1024, "Saagar K V", "Academic Excellence Award", "Impressive performance in academics", "14-07-2024"))
      .to.emit(award, "Issued")
      .withArgs("Academic Excellence Award", 1024, "14-07-2024");
  });

  it("Should read the award", async function () {
    const { award } = await loadFixture(deployAwardFixture);

    await award.issue(1024, "Saagar K V", "Academic Excellence Award", "Impressive performance in academics", "14-07-2024");

    const _award = await award.Awards(1024);

    expect(_award[0]).to.equal("Saagar K V");
    expect(_award[1]).to.equal("Academic Excellence Award");
    expect(_award[2]).to.equal("Impressive performance in academics");
    expect(_award[3]).to.equal("14-07-2024");
  });

  it("Should revert the issuing by a non-admin", async function () {
    const { award, other } = await loadFixture(deployAwardFixture);

    await expect(
      award.connect(other).issue(1024, "Saagar K V", "Academic Excellence Award", "Impressive performance in academics", "14-07-2024"),
    ).to.be.revertedWith("Access Denied");
  });
});