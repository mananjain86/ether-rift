const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AchievementToken", function () {
  let AchievementToken;
  let achievementToken;
  let owner;
  let minter;
  let pauser;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, minter, pauser, user1, user2] = await ethers.getSigners();
    
    AchievementToken = await ethers.getContractFactory("AchievementToken");
    achievementToken = await AchievementToken.deploy("EtherRift Achievement Token", "ERT");
    await achievementToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await achievementToken.name()).to.equal("EtherRift Achievement Token");
      expect(await achievementToken.symbol()).to.equal("ERT");
    });

    it("Should set the owner as admin, minter, and pauser", async function () {
      const DEFAULT_ADMIN_ROLE = await achievementToken.DEFAULT_ADMIN_ROLE();
      const MINTER_ROLE = await achievementToken.MINTER_ROLE();
      const PAUSER_ROLE = await achievementToken.PAUSER_ROLE();

      expect(await achievementToken.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
      expect(await achievementToken.hasRole(MINTER_ROLE, owner.address)).to.be.true;
      expect(await achievementToken.hasRole(PAUSER_ROLE, owner.address)).to.be.true;
    });

    it("Should start with zero total supply", async function () {
      expect(await achievementToken.totalSupply()).to.equal(0);
    });
  });

  describe("Role Management", function () {
    it("Should allow admin to grant minter role", async function () {
      const MINTER_ROLE = await achievementToken.MINTER_ROLE();
      await achievementToken.grantRole(MINTER_ROLE, minter.address);
      expect(await achievementToken.hasRole(MINTER_ROLE, minter.address)).to.be.true;
    });

    it("Should allow admin to grant pauser role", async function () {
      const PAUSER_ROLE = await achievementToken.PAUSER_ROLE();
      await achievementToken.grantRole(PAUSER_ROLE, pauser.address);
      expect(await achievementToken.hasRole(PAUSER_ROLE, pauser.address)).to.be.true;
    });

    it("Should allow admin to revoke roles", async function () {
      const MINTER_ROLE = await achievementToken.MINTER_ROLE();
      await achievementToken.grantRole(MINTER_ROLE, minter.address);
      await achievementToken.revokeRole(MINTER_ROLE, minter.address);
      expect(await achievementToken.hasRole(MINTER_ROLE, minter.address)).to.be.false;
    });

    it("Should not allow non-admin to grant roles", async function () {
      const MINTER_ROLE = await achievementToken.MINTER_ROLE();
      await expect(
        achievementToken.connect(user1).grantRole(MINTER_ROLE, user2.address)
      ).to.be.revertedWithCustomError(achievementToken, "AccessControlUnauthorizedAccount");
    });
  });

  describe("Minting", function () {
    it("Should allow minter to mint tokens", async function () {
      const MINTER_ROLE = await achievementToken.MINTER_ROLE();
      await achievementToken.grantRole(MINTER_ROLE, minter.address);
      
      const mintAmount = ethers.parseEther("100");
      await achievementToken.connect(minter).mint(user1.address, mintAmount);
      
      expect(await achievementToken.balanceOf(user1.address)).to.equal(mintAmount);
      expect(await achievementToken.totalSupply()).to.equal(mintAmount);
    });

    it("Should not allow non-minter to mint tokens", async function () {
      const mintAmount = ethers.parseEther("100");
      await expect(
        achievementToken.connect(user1).mint(user2.address, mintAmount)
      ).to.be.revertedWithCustomError(achievementToken, "AccessControlUnauthorizedAccount");
    });

    it("Should emit Transfer event when minting", async function () {
      const mintAmount = ethers.parseEther("100");
      await expect(achievementToken.mint(user1.address, mintAmount))
        .to.emit(achievementToken, "Transfer")
        .withArgs(ethers.ZeroAddress, user1.address, mintAmount);
    });

    it("Should not allow minting to zero address", async function () {
      const mintAmount = ethers.parseEther("100");
      await expect(
        achievementToken.mint(ethers.ZeroAddress, mintAmount)
      ).to.be.revertedWithCustomError(achievementToken, "ERC20InvalidReceiver");
    });
  });

  describe("Burning", function () {
    beforeEach(async function () {
      const mintAmount = ethers.parseEther("1000");
      await achievementToken.mint(user1.address, mintAmount);
    });

    it("Should allow users to burn their own tokens", async function () {
      const burnAmount = ethers.parseEther("100");
      const initialBalance = await achievementToken.balanceOf(user1.address);
      const initialSupply = await achievementToken.totalSupply();

      await achievementToken.connect(user1).burn(burnAmount);

      expect(await achievementToken.balanceOf(user1.address)).to.equal(initialBalance - burnAmount);
      expect(await achievementToken.totalSupply()).to.equal(initialSupply - burnAmount);
    });

    it("Should not allow burning more tokens than balance", async function () {
      const burnAmount = ethers.parseEther("2000");
      await expect(
        achievementToken.connect(user1).burn(burnAmount)
      ).to.be.revertedWithCustomError(achievementToken, "ERC20InsufficientBalance");
    });

    it("Should emit Transfer event when burning", async function () {
      const burnAmount = ethers.parseEther("100");
      await expect(achievementToken.connect(user1).burn(burnAmount))
        .to.emit(achievementToken, "Transfer")
        .withArgs(user1.address, ethers.ZeroAddress, burnAmount);
    });
  });

  describe("Transfer", function () {
    beforeEach(async function () {
      const mintAmount = ethers.parseEther("1000");
      await achievementToken.mint(user1.address, mintAmount);
    });

    it("Should allow users to transfer tokens", async function () {
      const transferAmount = ethers.parseEther("100");
      await achievementToken.connect(user1).transfer(user2.address, transferAmount);

      expect(await achievementToken.balanceOf(user1.address)).to.equal(ethers.parseEther("900"));
      expect(await achievementToken.balanceOf(user2.address)).to.equal(transferAmount);
    });

    it("Should not allow transferring more tokens than balance", async function () {
      const transferAmount = ethers.parseEther("2000");
      await expect(
        achievementToken.connect(user1).transfer(user2.address, transferAmount)
      ).to.be.revertedWithCustomError(achievementToken, "ERC20InsufficientBalance");
    });

    it("Should emit Transfer event when transferring", async function () {
      const transferAmount = ethers.parseEther("100");
      await expect(achievementToken.connect(user1).transfer(user2.address, transferAmount))
        .to.emit(achievementToken, "Transfer")
        .withArgs(user1.address, user2.address, transferAmount);
    });
  });

  describe("Pausing", function () {
    it("Should allow pauser to pause the contract", async function () {
      const PAUSER_ROLE = await achievementToken.PAUSER_ROLE();
      await achievementToken.grantRole(PAUSER_ROLE, pauser.address);
      
      await achievementToken.connect(pauser).pause();
      expect(await achievementToken.paused()).to.be.true;
    });

    it("Should not allow non-pauser to pause the contract", async function () {
      await expect(
        achievementToken.connect(user1).pause()
      ).to.be.revertedWithCustomError(achievementToken, "AccessControlUnauthorizedAccount");
    });

    it("Should allow pauser to unpause the contract", async function () {
      const PAUSER_ROLE = await achievementToken.PAUSER_ROLE();
      await achievementToken.grantRole(PAUSER_ROLE, pauser.address);
      
      await achievementToken.connect(pauser).pause();
      await achievementToken.connect(pauser).unpause();
      expect(await achievementToken.paused()).to.be.false;
    });

    it("Should not allow transfers when paused", async function () {
      await achievementToken.pause();
      
      const mintAmount = ethers.parseEther("100");
      await achievementToken.mint(user1.address, mintAmount);
      
      await expect(
        achievementToken.connect(user1).transfer(user2.address, ethers.parseEther("50"))
      ).to.be.revertedWithCustomError(achievementToken, "EnforcedPause");
    });

    it("Should not allow minting when paused", async function () {
      await achievementToken.pause();
      
      await expect(
        achievementToken.mint(user1.address, ethers.parseEther("100"))
      ).to.be.revertedWithCustomError(achievementToken, "EnforcedPause");
    });

    it("Should not allow burning when paused", async function () {
      const mintAmount = ethers.parseEther("100");
      await achievementToken.mint(user1.address, mintAmount);
      await achievementToken.pause();
      
      await expect(
        achievementToken.connect(user1).burn(ethers.parseEther("50"))
      ).to.be.revertedWithCustomError(achievementToken, "EnforcedPause");
    });
  });

  describe("Permit", function () {
    it("Should allow permit for approval", async function () {
      const owner = user1;
      const spender = user2;
      const value = ethers.parseEther("100");
      const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

      const nonce = await achievementToken.nonces(owner.address);
      const domain = {
        name: await achievementToken.name(),
        version: "1",
        chainId: await ethers.provider.getNetwork().then(n => n.chainId),
        verifyingContract: await achievementToken.getAddress()
      };

      const types = {
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" }
        ]
      };

      const message = {
        owner: owner.address,
        spender: spender.address,
        value: value,
        nonce: nonce,
        deadline: deadline
      };

      const signature = await owner.signTypedData(domain, types, message);
      const { v, r, s } = ethers.Signature.from(signature);

      await achievementToken.permit(owner.address, spender.address, value, deadline, v, r, s);
      
      expect(await achievementToken.allowance(owner.address, spender.address)).to.equal(value);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero amount transfers", async function () {
      const mintAmount = ethers.parseEther("100");
      await achievementToken.mint(user1.address, mintAmount);
      
      await expect(
        achievementToken.connect(user1).transfer(user2.address, 0)
      ).to.not.be.reverted;
    });

    it("Should handle zero amount minting", async function () {
      await expect(achievementToken.mint(user1.address, 0)).to.not.be.reverted;
    });

    it("Should handle zero amount burning", async function () {
      const mintAmount = ethers.parseEther("100");
      await achievementToken.mint(user1.address, mintAmount);
      
      await expect(achievementToken.connect(user1).burn(0)).to.not.be.reverted;
    });
  });
}); 