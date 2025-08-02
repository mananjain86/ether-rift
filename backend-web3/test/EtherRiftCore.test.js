const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EtherRiftCore", function () {
  let AchievementToken;
  let EtherRiftCore;
  let TradingFunctions;
  let achievementToken;
  let etherRiftCore;
  let tradingFunctions;
  let owner;
  let user1;
  let user2;
  let user3;

  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();
    
    // Deploy AchievementToken
    AchievementToken = await ethers.getContractFactory("AchievementToken");
    achievementToken = await AchievementToken.deploy("EtherRift Achievement Token", "ERT");
    await achievementToken.waitForDeployment();

    // Deploy EtherRiftCore
    EtherRiftCore = await ethers.getContractFactory("EtherRiftCore");
    etherRiftCore = await EtherRiftCore.deploy(await achievementToken.getAddress());
    await etherRiftCore.waitForDeployment();

    // Deploy TradingFunctions
    TradingFunctions = await ethers.getContractFactory("TradingFunctions");
    tradingFunctions = await TradingFunctions.deploy(await etherRiftCore.getAddress());
    await tradingFunctions.waitForDeployment();

    // Grant MINTER_ROLE to EtherRiftCore
    const MINTER_ROLE = await achievementToken.MINTER_ROLE();
    await achievementToken.grantRole(MINTER_ROLE, await etherRiftCore.getAddress());
    
    // Set trading functions address in EtherRiftCore
    await etherRiftCore.setTradingFunctions(await tradingFunctions.getAddress());
  });

  describe("Deployment", function () {
    it("Should set the correct achievement token address", async function () {
      expect(await etherRiftCore.achievementToken()).to.equal(await achievementToken.getAddress());
    });

    it("Should set initial token prices", async function () {
      const vETH = "0x0000000000000000000000000000000000000001";
      const vUSDC = "0x0000000000000000000000000000000000000002";
      const vDAI = "0x0000000000000000000000000000000000000003";

      expect(await etherRiftCore.getTokenPrice(vETH)).to.equal(ethers.parseEther("1000"));
      expect(await etherRiftCore.getTokenPrice(vUSDC)).to.equal(ethers.parseEther("1"));
      expect(await etherRiftCore.getTokenPrice(vDAI)).to.equal(ethers.parseEther("1"));
    });

    it("Should support the correct tokens", async function () {
      const vETH = "0x0000000000000000000000000000000000000001";
      const vUSDC = "0x0000000000000000000000000000000000000002";
      const vDAI = "0x0000000000000000000000000000000000000003";
      const unsupportedToken = "0x0000000000000000000000000000000000000004";

      expect(await etherRiftCore.isTokenSupported(vETH)).to.be.true;
      expect(await etherRiftCore.isTokenSupported(vUSDC)).to.be.true;
      expect(await etherRiftCore.isTokenSupported(vDAI)).to.be.true;
      expect(await etherRiftCore.isTokenSupported(unsupportedToken)).to.be.false;
    });
  });

  describe("User Registration", function () {
    it("Should allow users to register", async function () {
      await etherRiftCore.connect(user1).register();
      
      const playerInfo = await etherRiftCore.getPlayerInfo(user1.address);
      expect(playerInfo.isRegistered).to.be.true;
      expect(playerInfo.tradesCompleted).to.equal(0);
      expect(playerInfo.totalVolume).to.equal(0);
    });

    it("Should not allow users to register twice", async function () {
      await etherRiftCore.connect(user1).register();
      
      await expect(
        etherRiftCore.connect(user1).register()
      ).to.be.revertedWith("Already registered");
    });

    it("Should emit PlayerRegistered event", async function () {
      await expect(etherRiftCore.connect(user1).register())
        .to.emit(etherRiftCore, "PlayerRegistered")
        .withArgs(user1.address);
    });
  });

  describe("Trade Recording", function () {
    beforeEach(async function () {
      await etherRiftCore.connect(user1).register();
    });

    it("Should record trades correctly", async function () {
      const scenario = "swap_eth_usdc";
      const amount = ethers.parseEther("100");
      
      await etherRiftCore.connect(user1).recordTrade(scenario, amount);
      
      expect(await etherRiftCore.getPlayerTradeHistory(user1.address, scenario)).to.equal(1);
      
      const playerInfo = await etherRiftCore.getPlayerInfo(user1.address);
      expect(playerInfo.tradesCompleted).to.equal(1);
      expect(playerInfo.totalVolume).to.equal(amount);
    });

    it("Should not allow unregistered users to record trades", async function () {
      const scenario = "swap_eth_usdc";
      const amount = ethers.parseEther("100");
      
      await expect(
        etherRiftCore.connect(user2).recordTrade(scenario, amount)
      ).to.be.revertedWith("Player not registered");
    });

    it("Should emit TradeRecorded event", async function () {
      const scenario = "swap_eth_usdc";
      const amount = ethers.parseEther("100");
      
      await expect(etherRiftCore.connect(user1).recordTrade(scenario, amount))
        .to.emit(etherRiftCore, "TradeRecorded")
        .withArgs(user1.address, scenario, amount);
    });

    it("Should track multiple trades for same scenario", async function () {
      const scenario = "swap_eth_usdc";
      
      await etherRiftCore.connect(user1).recordTrade(scenario, ethers.parseEther("100"));
      await etherRiftCore.connect(user1).recordTrade(scenario, ethers.parseEther("200"));
      
      expect(await etherRiftCore.getPlayerTradeHistory(user1.address, scenario)).to.equal(2);
      
      const playerInfo = await etherRiftCore.getPlayerInfo(user1.address);
      expect(playerInfo.tradesCompleted).to.equal(2);
      expect(playerInfo.totalVolume).to.equal(ethers.parseEther("300"));
    });
  });

  describe("Achievement Unlocking", function () {
    beforeEach(async function () {
      await etherRiftCore.connect(user1).register();
    });

    it("Should allow owner to unlock achievements", async function () {
      const achievement = "first_swap";
      const tokenAmount = ethers.parseEther("10");
      
      await etherRiftCore.connect(owner).unlockAchievement(user1.address, achievement, tokenAmount);
      
      expect(await achievementToken.balanceOf(user1.address)).to.equal(tokenAmount);
    });

    it("Should not allow non-owner to unlock achievements", async function () {
      const achievement = "first_swap";
      const tokenAmount = ethers.parseEther("10");
      
      await expect(
        etherRiftCore.connect(user1).unlockAchievement(user2.address, achievement, tokenAmount)
      ).to.be.revertedWithCustomError(etherRiftCore, "OwnableUnauthorizedAccount");
    });

    it("Should not allow unlocking achievements for unregistered users", async function () {
      const achievement = "first_swap";
      const tokenAmount = ethers.parseEther("10");
      
      await expect(
        etherRiftCore.connect(owner).unlockAchievement(user2.address, achievement, tokenAmount)
      ).to.be.revertedWith("Player not registered");
    });

    it("Should emit AchievementUnlocked event", async function () {
      const achievement = "first_swap";
      const tokenAmount = ethers.parseEther("10");
      
      await expect(etherRiftCore.connect(owner).unlockAchievement(user1.address, achievement, tokenAmount))
        .to.emit(etherRiftCore, "AchievementUnlocked")
        .withArgs(user1.address, achievement, tokenAmount);
    });
  });



  describe("Token Value Calculations", function () {
    it("Should calculate token values correctly", async function () {
      const vETH = "0x0000000000000000000000000000000000000001";
      const vUSDC = "0x0000000000000000000000000000000000000002";
      
      const ethAmount = ethers.parseEther("1");
      const usdcAmount = ethers.parseEther("1000");
      
      expect(await etherRiftCore.getTokenValue(vETH, ethAmount)).to.equal(ethers.parseEther("1000"));
      expect(await etherRiftCore.getTokenValue(vUSDC, usdcAmount)).to.equal(ethers.parseEther("1000"));
    });
  });

  describe("Balance Management", function () {
    beforeEach(async function () {
      await etherRiftCore.connect(user1).register();
    });

    it("Should allow owner to update user balances", async function () {
      const vETH = "0x0000000000000000000000000000000000000001";
      const amount = ethers.parseEther("10");
      
      await etherRiftCore.connect(owner).updateUserBalance(user1.address, vETH, amount, true);
      expect(await etherRiftCore.getUserBalance(user1.address, vETH)).to.equal(amount);
      
      await etherRiftCore.connect(owner).updateUserBalance(user1.address, vETH, amount, false);
      expect(await etherRiftCore.getUserBalance(user1.address, vETH)).to.equal(0);
    });

    it("Should not allow non-owner to update balances", async function () {
      const vETH = "0x0000000000000000000000000000000000000001";
      const amount = ethers.parseEther("10");
      
      await expect(
        etherRiftCore.connect(user1).updateUserBalance(user2.address, vETH, amount, true)
      ).to.be.revertedWith("Only owner or trading functions can update balances");
    });

    it("Should not allow decreasing balance below zero", async function () {
      const vETH = "0x0000000000000000000000000000000000000001";
      const amount = ethers.parseEther("10");
      
      await expect(
        etherRiftCore.connect(owner).updateUserBalance(user1.address, vETH, amount, false)
      ).to.be.revertedWith("Insufficient balance");
    });
  });

  describe("Collateral Management", function () {
    beforeEach(async function () {
      await etherRiftCore.connect(user1).register();
    });

    it("Should allow owner to update user collateral", async function () {
      const vETH = "0x0000000000000000000000000000000000000001";
      const amount = ethers.parseEther("10");
      
      await etherRiftCore.connect(owner).updateUserCollateral(user1.address, vETH, amount, true);
      expect(await etherRiftCore.getUserCollateral(user1.address, vETH)).to.equal(amount);
      
      await etherRiftCore.connect(owner).updateUserCollateral(user1.address, vETH, amount, false);
      expect(await etherRiftCore.getUserCollateral(user1.address, vETH)).to.equal(0);
    });

    it("Should not allow non-owner to update collateral", async function () {
      const vETH = "0x0000000000000000000000000000000000000001";
      const amount = ethers.parseEther("10");
      
      await expect(
        etherRiftCore.connect(user1).updateUserCollateral(user2.address, vETH, amount, true)
      ).to.be.revertedWith("Only owner or trading functions can update collateral");
    });
  });

  describe("Debt Management", function () {
    beforeEach(async function () {
      await etherRiftCore.connect(user1).register();
    });

    it("Should allow owner to update user debt", async function () {
      const vUSDC = "0x0000000000000000000000000000000000000002";
      const amount = ethers.parseEther("100");
      
      await etherRiftCore.connect(owner).updateUserDebt(user1.address, vUSDC, amount, true);
      expect(await etherRiftCore.getUserDebt(user1.address, vUSDC)).to.equal(amount);
      
      await etherRiftCore.connect(owner).updateUserDebt(user1.address, vUSDC, amount, false);
      expect(await etherRiftCore.getUserDebt(user1.address, vUSDC)).to.equal(0);
    });

    it("Should not allow non-owner to update debt", async function () {
      const vUSDC = "0x0000000000000000000000000000000000000002";
      const amount = ethers.parseEther("100");
      
      await expect(
        etherRiftCore.connect(user1).updateUserDebt(user2.address, vUSDC, amount, true)
      ).to.be.revertedWith("Only owner or trading functions can update debt");
    });
  });

  describe("Staking Management", function () {
    beforeEach(async function () {
      await etherRiftCore.connect(user1).register();
    });

    it("Should allow owner to update user staked amounts", async function () {
      const vETH = "0x0000000000000000000000000000000000000001";
      const amount = ethers.parseEther("10");
      
      await etherRiftCore.connect(owner).updateUserStaked(user1.address, vETH, amount, true);
      expect(await etherRiftCore.getUserStaked(user1.address, vETH)).to.equal(amount);
      
      await etherRiftCore.connect(owner).updateUserStaked(user1.address, vETH, amount, false);
      expect(await etherRiftCore.getUserStaked(user1.address, vETH)).to.equal(0);
    });

    it("Should not allow non-owner to update staked amounts", async function () {
      const vETH = "0x0000000000000000000000000000000000000001";
      const amount = ethers.parseEther("10");
      
      await expect(
        etherRiftCore.connect(user1).updateUserStaked(user2.address, vETH, amount, true)
      ).to.be.revertedWith("Only owner or trading functions can update staked");
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero amounts in balance updates", async function () {
      await etherRiftCore.connect(user1).register();
      
      const vETH = "0x0000000000000000000000000000000000000001";
      
      await expect(
        etherRiftCore.connect(owner).updateUserBalance(user1.address, vETH, 0, true)
      ).to.not.be.reverted;
    });

    it("Should handle zero amounts in trade recording", async function () {
      await etherRiftCore.connect(user1).register();
      
      await expect(
        etherRiftCore.connect(user1).recordTrade("test", 0)
      ).to.not.be.reverted;
    });
  });
}); 