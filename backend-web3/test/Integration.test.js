const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EtherRift Integration Tests", function () {
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

  // Token addresses
  const vETH = "0x0000000000000000000000000000000000000001";
  const vUSDC = "0x0000000000000000000000000000000000000002";
  const vDAI = "0x0000000000000000000000000000000000000003";

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

  describe("Complete User Journey", function () {
    it("Should complete a full user journey from registration to advanced trading", async function () {
      // 1. User registration
      await etherRiftCore.connect(user1).register();
      
      let playerInfo = await etherRiftCore.getPlayerInfo(user1.address);
      expect(playerInfo.isRegistered).to.be.true;

      // 2. Give user initial balances
      await etherRiftCore.connect(owner).updateUserBalance(user1.address, vUSDC, ethers.parseEther("10000"), true);
      await etherRiftCore.connect(owner).updateUserBalance(user1.address, vETH, ethers.parseEther("5"), true);

      // 3. First trade - Buy ETH
      await tradingFunctions.connect(user1).buy(vETH, ethers.parseEther("1"));
      await etherRiftCore.connect(user1).recordTrade("buy_eth", ethers.parseEther("1000"));
      
      playerInfo = await etherRiftCore.getPlayerInfo(user1.address);
      expect(playerInfo.tradesCompleted).to.equal(1);

      // 4. Second trade - Stake ETH
      await tradingFunctions.connect(user1).stake(vETH, ethers.parseEther("2"));
      await etherRiftCore.connect(user1).recordTrade("stake_eth", ethers.parseEther("2000"));
      
      playerInfo = await etherRiftCore.getPlayerInfo(user1.address);
      expect(playerInfo.tradesCompleted).to.equal(2);

      // 5. Third trade - Swap ETH to USDC
      await tradingFunctions.connect(user1).swap(vETH, vUSDC, ethers.parseEther("1"));
      await etherRiftCore.connect(user1).recordTrade("swap_eth_usdc", ethers.parseEther("1000"));
      
      playerInfo = await etherRiftCore.getPlayerInfo(user1.address);
      expect(playerInfo.tradesCompleted).to.equal(3);

      // 6. Fourth trade - Lend USDC
      await tradingFunctions.connect(user1).lend(vUSDC, ethers.parseEther("500"));
      await etherRiftCore.connect(user1).recordTrade("lend_usdc", ethers.parseEther("500"));
      
      playerInfo = await etherRiftCore.getPlayerInfo(user1.address);
      expect(playerInfo.tradesCompleted).to.equal(4);

      // 7. Fifth trade - Borrow USDC
      await tradingFunctions.connect(user1).borrow(vUSDC, ethers.parseEther("100"), vETH, ethers.parseEther("1"));
      await etherRiftCore.connect(user1).recordTrade("borrow_usdc", ethers.parseEther("100"));
      
      playerInfo = await etherRiftCore.getPlayerInfo(user1.address);
      expect(playerInfo.tradesCompleted).to.equal(5);

      // 8. Sixth trade - Flash loan
      await tradingFunctions.connect(user1).flashLoan(vUSDC, ethers.parseEther("100"));
      await etherRiftCore.connect(user1).recordTrade("flash_loan", ethers.parseEther("100"));
      
      playerInfo = await etherRiftCore.getPlayerInfo(user1.address);
      expect(playerInfo.tradesCompleted).to.equal(6);

      // 9. Seventh trade - Repay debt
      await tradingFunctions.connect(user1).repay(vUSDC, ethers.parseEther("50"));
      await etherRiftCore.connect(user1).recordTrade("repay_debt", ethers.parseEther("50"));
      
      playerInfo = await etherRiftCore.getPlayerInfo(user1.address);
      expect(playerInfo.tradesCompleted).to.equal(7);

      // 10. Eighth trade - Unstake ETH
      await tradingFunctions.connect(user1).unstake(vETH, ethers.parseEther("1"));
      await etherRiftCore.connect(user1).recordTrade("unstake_eth", ethers.parseEther("1000"));
      
      playerInfo = await etherRiftCore.getPlayerInfo(user1.address);
      expect(playerInfo.tradesCompleted).to.equal(8);

      // 11. Ninth trade - Sell ETH
      await tradingFunctions.connect(user1).sell(vETH, ethers.parseEther("1"));
      await etherRiftCore.connect(user1).recordTrade("sell_eth", ethers.parseEther("1000"));
      
      playerInfo = await etherRiftCore.getPlayerInfo(user1.address);
      expect(playerInfo.tradesCompleted).to.equal(9);

      // 12. Tenth trade - Final trade to unlock Arbitrage
      await tradingFunctions.connect(user1).swap(vUSDC, vDAI, ethers.parseEther("100"));
      await etherRiftCore.connect(user1).recordTrade("swap_usdc_dai", ethers.parseEther("100"));
      
      playerInfo = await etherRiftCore.getPlayerInfo(user1.address);
      expect(playerInfo.tradesCompleted).to.equal(10);

      // 13. Unlock achievement
      await etherRiftCore.connect(owner).unlockAchievement(user1.address, "master_trader", ethers.parseEther("100"));
      
      expect(await achievementToken.balanceOf(user1.address)).to.equal(ethers.parseEther("100"));
    });
  });

  describe("Multi-User Scenarios", function () {
    it("Should handle multiple users trading simultaneously", async function () {
      // Register multiple users
      await etherRiftCore.connect(user1).register();
      await etherRiftCore.connect(user2).register();
      await etherRiftCore.connect(user3).register();

      // Give users initial balances
      await etherRiftCore.connect(owner).updateUserBalance(user1.address, vUSDC, ethers.parseEther("10000"), true);
      await etherRiftCore.connect(owner).updateUserBalance(user2.address, vUSDC, ethers.parseEther("10000"), true);
      await etherRiftCore.connect(owner).updateUserBalance(user3.address, vUSDC, ethers.parseEther("10000"), true);

      // User1 buys ETH
      await tradingFunctions.connect(user1).buy(vETH, ethers.parseEther("1"));
      await etherRiftCore.connect(user1).recordTrade("buy_eth", ethers.parseEther("1000"));

      // User2 buys ETH
      await tradingFunctions.connect(user2).buy(vETH, ethers.parseEther("2"));
      await etherRiftCore.connect(user2).recordTrade("buy_eth", ethers.parseEther("2000"));

      // User3 swaps USDC to DAI
      await tradingFunctions.connect(user3).swap(vUSDC, vDAI, ethers.parseEther("500"));
      await etherRiftCore.connect(user3).recordTrade("swap_usdc_dai", ethers.parseEther("500"));

      // Verify all users have correct trade counts
      let player1Info = await etherRiftCore.getPlayerInfo(user1.address);
      let player2Info = await etherRiftCore.getPlayerInfo(user2.address);
      let player3Info = await etherRiftCore.getPlayerInfo(user3.address);

      expect(player1Info.tradesCompleted).to.equal(1);
      expect(player2Info.tradesCompleted).to.equal(1);
      expect(player3Info.tradesCompleted).to.equal(1);

      // Verify balances are updated correctly
      expect(await etherRiftCore.getUserBalance(user1.address, vETH)).to.equal(ethers.parseEther("1"));
      expect(await etherRiftCore.getUserBalance(user2.address, vETH)).to.equal(ethers.parseEther("2"));
      expect(await etherRiftCore.getUserBalance(user3.address, vDAI)).to.be.gt(0);
    });
  });

  describe("Achievement System Integration", function () {
    it("Should properly integrate achievement system with trading", async function () {
      await etherRiftCore.connect(user1).register();
      
      // Give user initial balance
      await etherRiftCore.connect(owner).updateUserBalance(user1.address, vUSDC, ethers.parseEther("10000"), true);

      // Perform trades to unlock dimensions
      for (let i = 0; i < 10; i++) {
        await tradingFunctions.connect(user1).buy(vETH, ethers.parseEther("0.1"));
        await etherRiftCore.connect(user1).recordTrade(`trade_${i}`, ethers.parseEther("100"));
      }

      // Unlock achievements based on progress
      await etherRiftCore.connect(owner).unlockAchievement(user1.address, "first_trade", ethers.parseEther("10"));
      await etherRiftCore.connect(owner).unlockAchievement(user1.address, "volatile_unlocked", ethers.parseEther("25"));
      await etherRiftCore.connect(owner).unlockAchievement(user1.address, "arbitrage_unlocked", ethers.parseEther("50"));

      // Verify achievement tokens
      expect(await achievementToken.balanceOf(user1.address)).to.equal(ethers.parseEther("85"));

      // Verify trades completed
      const playerInfo = await etherRiftCore.getPlayerInfo(user1.address);
      expect(playerInfo.tradesCompleted).to.equal(10);
    });
  });

  describe("Complex Trading Scenarios", function () {
    it("Should handle complex trading scenarios with multiple operations", async function () {
      await etherRiftCore.connect(user1).register();
      
      // Give user initial balances
      await etherRiftCore.connect(owner).updateUserBalance(user1.address, vUSDC, ethers.parseEther("10000"), true);
      await etherRiftCore.connect(owner).updateUserBalance(user1.address, vETH, ethers.parseEther("10"), true);

      // Complex scenario: Buy, Stake, Borrow, Swap, Repay, Unstake, Sell
      
      // 1. Buy more ETH
      await tradingFunctions.connect(user1).buy(vETH, ethers.parseEther("2"));
      
      // 2. Stake some ETH
      await tradingFunctions.connect(user1).stake(vETH, ethers.parseEther("3"));
      
      // 3. Borrow USDC using ETH as collateral
      await tradingFunctions.connect(user1).borrow(vUSDC, ethers.parseEther("500"), vETH, ethers.parseEther("1"));
      
      // 4. Swap borrowed USDC to DAI
      await tradingFunctions.connect(user1).swap(vUSDC, vDAI, ethers.parseEther("200"));
      
      // 5. Repay some debt
      await tradingFunctions.connect(user1).repay(vUSDC, ethers.parseEther("100"));
      
      // 6. Unstake some ETH
      await tradingFunctions.connect(user1).unstake(vETH, ethers.parseEther("1"));
      
      // 7. Sell some ETH
      await tradingFunctions.connect(user1).sell(vETH, ethers.parseEther("1"));

      // Verify final balances
      const finalETH = await etherRiftCore.getUserBalance(user1.address, vETH);
      const finalUSDC = await etherRiftCore.getUserBalance(user1.address, vUSDC);
      const finalDAI = await etherRiftCore.getUserBalance(user1.address, vDAI);
      const stakedETH = await etherRiftCore.getUserStaked(user1.address, vETH);
      const debtUSDC = await etherRiftCore.getUserDebt(user1.address, vUSDC);
      const collateralETH = await etherRiftCore.getUserCollateral(user1.address, vETH);

      expect(finalETH).to.be.gt(0);
      expect(finalUSDC).to.be.gt(0);
      expect(finalDAI).to.be.gt(0);
      expect(stakedETH).to.be.gt(0);
      expect(debtUSDC).to.be.gt(0);
      expect(collateralETH).to.be.gt(0);
    });
  });

  describe("Error Handling and Edge Cases", function () {
    it("Should handle edge cases and errors properly", async function () {
      await etherRiftCore.connect(user1).register();
      
      // Give user initial balance
      await etherRiftCore.connect(owner).updateUserBalance(user1.address, vUSDC, ethers.parseEther("1000"), true);

      // Try to buy more than user can afford
      await expect(
        tradingFunctions.connect(user1).buy(vETH, ethers.parseEther("100"))
      ).to.be.revertedWith("Insufficient USDC");

      // Try to sell tokens user doesn't have
      await expect(
        tradingFunctions.connect(user1).sell(vETH, ethers.parseEther("1"))
      ).to.be.revertedWith("Insufficient tokens");

      // Try to stake tokens user doesn't have
      await expect(
        tradingFunctions.connect(user1).stake(vETH, ethers.parseEther("1"))
      ).to.be.revertedWith("Insufficient tokens");

      // Give user some ETH first, then try to borrow without sufficient collateralization
      await etherRiftCore.connect(owner).updateUserBalance(user1.address, vETH, ethers.parseEther("1"), true);
      await expect(
        tradingFunctions.connect(user1).borrow(vUSDC, ethers.parseEther("1000"), vETH, ethers.parseEther("1"))
      ).to.be.revertedWith("Insufficient collateralization");

      // Try to repay when no debt
      await expect(
        tradingFunctions.connect(user1).repay(vUSDC, ethers.parseEther("100"))
      ).to.be.revertedWith("No debt to repay");

      // Try to record trade without registration
      await expect(
        etherRiftCore.connect(user2).recordTrade("test", ethers.parseEther("100"))
      ).to.be.revertedWith("Player not registered");

      // Try to unlock achievement for unregistered user
      await expect(
        etherRiftCore.connect(owner).unlockAchievement(user2.address, "test", ethers.parseEther("10"))
      ).to.be.revertedWith("Player not registered");
    });
  });

  describe("Contract State Consistency", function () {
    it("Should maintain consistent state across all contracts", async function () {
      await etherRiftCore.connect(user1).register();
      
      // Give user initial balances
      await etherRiftCore.connect(owner).updateUserBalance(user1.address, vUSDC, ethers.parseEther("10000"), true);
      await etherRiftCore.connect(owner).updateUserBalance(user1.address, vETH, ethers.parseEther("5"), true);

      // Perform a series of operations
      await tradingFunctions.connect(user1).buy(vETH, ethers.parseEther("1"));
      await tradingFunctions.connect(user1).stake(vETH, ethers.parseEther("2"));
      await tradingFunctions.connect(user1).borrow(vUSDC, ethers.parseEther("100"), vETH, ethers.parseEther("1"));
      await tradingFunctions.connect(user1).swap(vUSDC, vDAI, ethers.parseEther("50"));
      await tradingFunctions.connect(user1).repay(vUSDC, ethers.parseEther("25"));

      // Record trades
      await etherRiftCore.connect(user1).recordTrade("buy_eth", ethers.parseEther("1000"));
      await etherRiftCore.connect(user1).recordTrade("stake_eth", ethers.parseEther("2000"));
      await etherRiftCore.connect(user1).recordTrade("borrow_usdc", ethers.parseEther("100"));
      await etherRiftCore.connect(user1).recordTrade("swap_usdc_dai", ethers.parseEther("50"));
      await etherRiftCore.connect(user1).recordTrade("repay_usdc", ethers.parseEther("25"));

      // Unlock achievement
      await etherRiftCore.connect(owner).unlockAchievement(user1.address, "active_trader", ethers.parseEther("10"));

      // Verify all state is consistent
      const playerInfo = await etherRiftCore.getPlayerInfo(user1.address);
      expect(playerInfo.tradesCompleted).to.equal(5);

      expect(await etherRiftCore.getUserBalance(user1.address, vETH)).to.be.gt(0);
      expect(await etherRiftCore.getUserBalance(user1.address, vUSDC)).to.be.gt(0);
      expect(await etherRiftCore.getUserBalance(user1.address, vDAI)).to.be.gt(0);
      expect(await etherRiftCore.getUserStaked(user1.address, vETH)).to.be.gt(0);
      expect(await etherRiftCore.getUserDebt(user1.address, vUSDC)).to.be.gt(0);
      expect(await etherRiftCore.getUserCollateral(user1.address, vETH)).to.be.gt(0);
      expect(await achievementToken.balanceOf(user1.address)).to.equal(ethers.parseEther("10"));
    });
  });
}); 