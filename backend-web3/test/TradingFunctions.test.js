const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TradingFunctions", function () {
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

    // Register users
    await etherRiftCore.connect(user1).register();
    await etherRiftCore.connect(user2).register();

    // Give users initial USDC balance
    await etherRiftCore.connect(owner).updateUserBalance(user1.address, vUSDC, ethers.parseEther("10000"), true);
    await etherRiftCore.connect(owner).updateUserBalance(user2.address, vUSDC, ethers.parseEther("10000"), true);
  });

  describe("Deployment", function () {
    it("Should set the correct core contract address", async function () {
      expect(await tradingFunctions.coreContract()).to.equal(await etherRiftCore.getAddress());
    });
  });

  describe("Buy Function", function () {
    it("Should allow users to buy tokens with USDC", async function () {
      const buyAmount = ethers.parseEther("1"); // 1 ETH
      const expectedCost = ethers.parseEther("1003"); // 1000 + 0.3% fee
      
      const initialUSDC = await etherRiftCore.getUserBalance(user1.address, vUSDC);
      const initialETH = await etherRiftCore.getUserBalance(user1.address, vETH);
      
      await tradingFunctions.connect(user1).buy(vETH, buyAmount);
      
      expect(await etherRiftCore.getUserBalance(user1.address, vUSDC)).to.equal(initialUSDC - expectedCost);
      expect(await etherRiftCore.getUserBalance(user1.address, vETH)).to.equal(initialETH + buyAmount);
    });

    it("Should not allow buying with insufficient USDC", async function () {
      const buyAmount = ethers.parseEther("100"); // 100 ETH = 100,000 USDC
      
      await expect(
        tradingFunctions.connect(user1).buy(vETH, buyAmount)
      ).to.be.revertedWith("Insufficient USDC");
    });

    it("Should not allow buying unsupported tokens", async function () {
      const unsupportedToken = "0x0000000000000000000000000000000000000004";
      const buyAmount = ethers.parseEther("1");
      
      await expect(
        tradingFunctions.connect(user1).buy(unsupportedToken, buyAmount)
      ).to.be.revertedWith("Token not supported");
    });

    it("Should not allow buying zero amount", async function () {
      await expect(
        tradingFunctions.connect(user1).buy(vETH, 0)
      ).to.be.revertedWith("Amount must be greater than 0");
    });

    it("Should emit Buy event", async function () {
      const buyAmount = ethers.parseEther("1");
      const expectedCost = ethers.parseEther("1003");
      
      await expect(tradingFunctions.connect(user1).buy(vETH, buyAmount))
        .to.emit(tradingFunctions, "Buy")
        .withArgs(user1.address, vETH, buyAmount, expectedCost);
    });
  });

  describe("Sell Function", function () {
    beforeEach(async function () {
      // Give user1 some ETH to sell
      await etherRiftCore.connect(owner).updateUserBalance(user1.address, vETH, ethers.parseEther("10"), true);
    });

    it("Should allow users to sell tokens for USDC", async function () {
      const sellAmount = ethers.parseEther("1"); // 1 ETH
      const expectedProceeds = ethers.parseEther("997"); // 1000 - 0.3% fee
      
      const initialUSDC = await etherRiftCore.getUserBalance(user1.address, vUSDC);
      const initialETH = await etherRiftCore.getUserBalance(user1.address, vETH);
      
      await tradingFunctions.connect(user1).sell(vETH, sellAmount);
      
      expect(await etherRiftCore.getUserBalance(user1.address, vUSDC)).to.equal(initialUSDC + expectedProceeds);
      expect(await etherRiftCore.getUserBalance(user1.address, vETH)).to.equal(initialETH - sellAmount);
    });

    it("Should not allow selling more tokens than balance", async function () {
      const sellAmount = ethers.parseEther("20"); // More than user has
      
      await expect(
        tradingFunctions.connect(user1).sell(vETH, sellAmount)
      ).to.be.revertedWith("Insufficient tokens");
    });

    it("Should not allow selling zero amount", async function () {
      await expect(
        tradingFunctions.connect(user1).sell(vETH, 0)
      ).to.be.revertedWith("Amount must be greater than 0");
    });

    it("Should emit Sell event", async function () {
      const sellAmount = ethers.parseEther("1");
      const expectedProceeds = ethers.parseEther("997");
      
      await expect(tradingFunctions.connect(user1).sell(vETH, sellAmount))
        .to.emit(tradingFunctions, "Sell")
        .withArgs(user1.address, vETH, sellAmount, expectedProceeds);
    });
  });

  describe("Stake Function", function () {
    beforeEach(async function () {
      // Give user1 some ETH to stake
      await etherRiftCore.connect(owner).updateUserBalance(user1.address, vETH, ethers.parseEther("10"), true);
    });

    it("Should allow users to stake tokens", async function () {
      const stakeAmount = ethers.parseEther("5");
      
      const initialBalance = await etherRiftCore.getUserBalance(user1.address, vETH);
      const initialStaked = await etherRiftCore.getUserStaked(user1.address, vETH);
      
      await tradingFunctions.connect(user1).stake(vETH, stakeAmount);
      
      expect(await etherRiftCore.getUserBalance(user1.address, vETH)).to.equal(initialBalance - stakeAmount);
      expect(await etherRiftCore.getUserStaked(user1.address, vETH)).to.equal(initialStaked + stakeAmount);
    });

    it("Should not allow staking more tokens than balance", async function () {
      const stakeAmount = ethers.parseEther("20"); // More than user has
      
      await expect(
        tradingFunctions.connect(user1).stake(vETH, stakeAmount)
      ).to.be.revertedWith("Insufficient tokens");
    });

    it("Should not allow staking zero amount", async function () {
      await expect(
        tradingFunctions.connect(user1).stake(vETH, 0)
      ).to.be.revertedWith("Amount must be greater than 0");
    });

    it("Should emit Stake event", async function () {
      const stakeAmount = ethers.parseEther("5");
      
      await expect(tradingFunctions.connect(user1).stake(vETH, stakeAmount))
        .to.emit(tradingFunctions, "Stake")
        .withArgs(user1.address, vETH, stakeAmount);
    });
  });

  describe("Unstake Function", function () {
    beforeEach(async function () {
      // Give user1 some staked ETH
      await etherRiftCore.connect(owner).updateUserStaked(user1.address, vETH, ethers.parseEther("10"), true);
    });

    it("Should allow users to unstake tokens", async function () {
      const unstakeAmount = ethers.parseEther("5");
      
      const initialBalance = await etherRiftCore.getUserBalance(user1.address, vETH);
      const initialStaked = await etherRiftCore.getUserStaked(user1.address, vETH);
      
      await tradingFunctions.connect(user1).unstake(vETH, unstakeAmount);
      
      expect(await etherRiftCore.getUserBalance(user1.address, vETH)).to.equal(initialBalance + unstakeAmount);
      expect(await etherRiftCore.getUserStaked(user1.address, vETH)).to.equal(initialStaked - unstakeAmount);
    });

    it("Should not allow unstaking more tokens than staked", async function () {
      const unstakeAmount = ethers.parseEther("20"); // More than user has staked
      
      await expect(
        tradingFunctions.connect(user1).unstake(vETH, unstakeAmount)
      ).to.be.revertedWith("Insufficient staked tokens");
    });

    it("Should not allow unstaking zero amount", async function () {
      await expect(
        tradingFunctions.connect(user1).unstake(vETH, 0)
      ).to.be.revertedWith("Amount must be greater than 0");
    });

    it("Should emit Unstake event", async function () {
      const unstakeAmount = ethers.parseEther("5");
      
      await expect(tradingFunctions.connect(user1).unstake(vETH, unstakeAmount))
        .to.emit(tradingFunctions, "Unstake")
        .withArgs(user1.address, vETH, unstakeAmount);
    });
  });

  describe("Lend Function", function () {
    beforeEach(async function () {
      // Reset user1's USDC balance to exactly 1000
      await etherRiftCore.connect(owner).updateUserBalance(user1.address, vUSDC, 0, false);
      await etherRiftCore.connect(owner).updateUserBalance(user1.address, vUSDC, ethers.parseEther("1000"), true);
    });

    it("Should allow users to lend tokens", async function () {
      const lendAmount = ethers.parseEther("500");
      
      const initialBalance = await etherRiftCore.getUserBalance(user1.address, vUSDC);
      
      await tradingFunctions.connect(user1).lend(vUSDC, lendAmount);
      
      expect(await etherRiftCore.getUserBalance(user1.address, vUSDC)).to.equal(initialBalance - lendAmount);
    });

    it("Should not allow lending more tokens than balance", async function () {
      // Ensure user has exactly 1000 USDC
      await etherRiftCore.connect(owner).updateUserBalance(user1.address, vUSDC, 0, false);
      await etherRiftCore.connect(owner).updateUserBalance(user1.address, vUSDC, ethers.parseEther("1000"), true);
      
      const lendAmount = ethers.parseEther("2000"); // More than user has
      
      await expect(
        tradingFunctions.connect(user1).lend(vUSDC, lendAmount)
      ).to.be.revertedWith("Insufficient tokens");
    });

    it("Should not allow lending zero amount", async function () {
      await expect(
        tradingFunctions.connect(user1).lend(vUSDC, 0)
      ).to.be.revertedWith("Amount must be greater than 0");
    });

    it("Should emit Lend event", async function () {
      const lendAmount = ethers.parseEther("500");
      
      await expect(tradingFunctions.connect(user1).lend(vUSDC, lendAmount))
        .to.emit(tradingFunctions, "Lend")
        .withArgs(user1.address, vUSDC, lendAmount);
    });
  });

  describe("Borrow Function", function () {
    beforeEach(async function () {
      // Give user1 some ETH as collateral
      await etherRiftCore.connect(owner).updateUserBalance(user1.address, vETH, ethers.parseEther("10"), true);
    });

    it("Should allow users to borrow with sufficient collateral", async function () {
      const borrowAmount = ethers.parseEther("100"); // 100 USDC
      const collateralAmount = ethers.parseEther("1"); // 1 ETH = 1000 USDC
      
      const initialBalance = await etherRiftCore.getUserBalance(user1.address, vUSDC);
      const initialCollateral = await etherRiftCore.getUserCollateral(user1.address, vETH);
      
      await tradingFunctions.connect(user1).borrow(vUSDC, borrowAmount, vETH, collateralAmount);
      
      expect(await etherRiftCore.getUserBalance(user1.address, vUSDC)).to.equal(initialBalance + borrowAmount);
      expect(await etherRiftCore.getUserCollateral(user1.address, vETH)).to.equal(initialCollateral + collateralAmount);
      expect(await etherRiftCore.getUserDebt(user1.address, vUSDC)).to.equal(borrowAmount);
    });

    it("Should not allow borrowing with insufficient collateral", async function () {
      const borrowAmount = ethers.parseEther("1000"); // 1000 USDC
      const collateralAmount = ethers.parseEther("1"); // 1 ETH = 1000 USDC, but need 150% ratio
      
      await expect(
        tradingFunctions.connect(user1).borrow(vUSDC, borrowAmount, vETH, collateralAmount)
      ).to.be.revertedWith("Insufficient collateralization");
    });

    it("Should not allow borrowing with insufficient collateral balance", async function () {
      const borrowAmount = ethers.parseEther("100");
      const collateralAmount = ethers.parseEther("20"); // More than user has
      
      await expect(
        tradingFunctions.connect(user1).borrow(vUSDC, borrowAmount, vETH, collateralAmount)
      ).to.be.revertedWith("Insufficient collateral");
    });

    it("Should not allow borrowing zero amount", async function () {
      const collateralAmount = ethers.parseEther("1");
      
      await expect(
        tradingFunctions.connect(user1).borrow(vUSDC, 0, vETH, collateralAmount)
      ).to.be.revertedWith("Amount must be greater than 0");
    });

    it("Should not allow zero collateral amount", async function () {
      const borrowAmount = ethers.parseEther("100");
      
      await expect(
        tradingFunctions.connect(user1).borrow(vUSDC, borrowAmount, vETH, 0)
      ).to.be.revertedWith("Collateral amount must be greater than 0");
    });

    it("Should emit Borrow event", async function () {
      const borrowAmount = ethers.parseEther("100");
      const collateralAmount = ethers.parseEther("1");
      const collateralValue = ethers.parseEther("1000");
      
      await expect(tradingFunctions.connect(user1).borrow(vUSDC, borrowAmount, vETH, collateralAmount))
        .to.emit(tradingFunctions, "Borrow")
        .withArgs(user1.address, vUSDC, borrowAmount, collateralValue);
    });
  });

  describe("Swap Function", function () {
    beforeEach(async function () {
      // Give user1 some ETH to swap
      await etherRiftCore.connect(owner).updateUserBalance(user1.address, vETH, ethers.parseEther("10"), true);
    });

    it("Should allow users to swap tokens", async function () {
      const swapAmount = ethers.parseEther("1"); // 1 ETH
      const expectedUSDC = ethers.parseEther("997"); // 1000 - 0.3% slippage
      
      const initialETH = await etherRiftCore.getUserBalance(user1.address, vETH);
      const initialUSDC = await etherRiftCore.getUserBalance(user1.address, vUSDC);
      
      await tradingFunctions.connect(user1).swap(vETH, vUSDC, swapAmount);
      
      expect(await etherRiftCore.getUserBalance(user1.address, vETH)).to.equal(initialETH - swapAmount);
      expect(await etherRiftCore.getUserBalance(user1.address, vUSDC)).to.equal(initialUSDC + expectedUSDC);
    });

    it("Should not allow swapping same token", async function () {
      const swapAmount = ethers.parseEther("1");
      
      await expect(
        tradingFunctions.connect(user1).swap(vETH, vETH, swapAmount)
      ).to.be.revertedWith("Cannot swap same token");
    });

    it("Should not allow swapping more tokens than balance", async function () {
      const swapAmount = ethers.parseEther("20"); // More than user has
      
      await expect(
        tradingFunctions.connect(user1).swap(vETH, vUSDC, swapAmount)
      ).to.be.revertedWith("Insufficient tokens");
    });

    it("Should not allow swapping zero amount", async function () {
      await expect(
        tradingFunctions.connect(user1).swap(vETH, vUSDC, 0)
      ).to.be.revertedWith("Amount must be greater than 0");
    });

    it("Should emit Swap event", async function () {
      const swapAmount = ethers.parseEther("1");
      const expectedUSDC = ethers.parseEther("997");
      
      await expect(tradingFunctions.connect(user1).swap(vETH, vUSDC, swapAmount))
        .to.emit(tradingFunctions, "Swap")
        .withArgs(user1.address, vETH, vUSDC, swapAmount, expectedUSDC);
    });
  });

  describe("Repay Function", function () {
    beforeEach(async function () {
      // Reset user1's balances and give them debt and USDC to repay
      await etherRiftCore.connect(owner).updateUserBalance(user1.address, vUSDC, 0, false);
      await etherRiftCore.connect(owner).updateUserDebt(user1.address, vUSDC, 0, false);
      await etherRiftCore.connect(owner).updateUserDebt(user1.address, vUSDC, ethers.parseEther("500"), true);
      await etherRiftCore.connect(owner).updateUserBalance(user1.address, vUSDC, ethers.parseEther("1000"), true);
    });

    it("Should allow users to repay debt", async function () {
      const repayAmount = ethers.parseEther("200");
      
      const initialBalance = await etherRiftCore.getUserBalance(user1.address, vUSDC);
      const initialDebt = await etherRiftCore.getUserDebt(user1.address, vUSDC);
      
      await tradingFunctions.connect(user1).repay(vUSDC, repayAmount);
      
      expect(await etherRiftCore.getUserBalance(user1.address, vUSDC)).to.equal(initialBalance - repayAmount);
      expect(await etherRiftCore.getUserDebt(user1.address, vUSDC)).to.equal(initialDebt - repayAmount);
    });

    it("Should cap repayment at debt amount", async function () {
      const repayAmount = ethers.parseEther("1000"); // More than debt
      const debtAmount = ethers.parseEther("500");
      
      const initialBalance = await etherRiftCore.getUserBalance(user1.address, vUSDC);
      
      await tradingFunctions.connect(user1).repay(vUSDC, repayAmount);
      
      expect(await etherRiftCore.getUserBalance(user1.address, vUSDC)).to.equal(initialBalance - debtAmount);
      expect(await etherRiftCore.getUserDebt(user1.address, vUSDC)).to.equal(0);
    });

    it("Should not allow repaying more tokens than balance", async function () {
      const repayAmount = ethers.parseEther("2000"); // More than user has
      
      await expect(
        tradingFunctions.connect(user1).repay(vUSDC, repayAmount)
      ).to.be.revertedWith("Insufficient tokens to repay");
    });

    it("Should not allow repaying when no debt", async function () {
      // Clear debt
      await etherRiftCore.connect(owner).updateUserDebt(user1.address, vUSDC, 0, false);
      
      await expect(
        tradingFunctions.connect(user1).repay(vUSDC, ethers.parseEther("100"))
      ).to.be.revertedWith("No debt to repay");
    });

    it("Should not allow repaying zero amount", async function () {
      await expect(
        tradingFunctions.connect(user1).repay(vUSDC, 0)
      ).to.be.revertedWith("Amount must be greater than 0");
    });

    it("Should emit Repay event", async function () {
      const repayAmount = ethers.parseEther("200");
      
      await expect(tradingFunctions.connect(user1).repay(vUSDC, repayAmount))
        .to.emit(tradingFunctions, "Repay")
        .withArgs(user1.address, vUSDC, repayAmount);
    });
  });

  describe("FlashLoan Function", function () {
    beforeEach(async function () {
      // Reset user1's USDC balance and give them enough to repay flash loan
      await etherRiftCore.connect(owner).updateUserBalance(user1.address, vUSDC, 0, false);
      await etherRiftCore.connect(owner).updateUserBalance(user1.address, vUSDC, ethers.parseEther("1000"), true);
    });

    it("Should allow users to execute flash loans", async function () {
      const flashLoanAmount = ethers.parseEther("100");
      const fee = flashLoanAmount * 1n / 1000n; // 0.1% fee
      
      const initialBalance = await etherRiftCore.getUserBalance(user1.address, vUSDC);
      
      await tradingFunctions.connect(user1).flashLoan(vUSDC, flashLoanAmount);
      
      // User should only pay the fee, not the full amount
      expect(await etherRiftCore.getUserBalance(user1.address, vUSDC)).to.equal(initialBalance - fee);
    });

    it("Should not allow flash loans with insufficient repayment", async function () {
      const flashLoanAmount = ethers.parseEther("10000"); // More than user can repay
      
      await expect(
        tradingFunctions.connect(user1).flashLoan(vUSDC, flashLoanAmount)
      ).to.be.revertedWith("Insufficient tokens to repay flash loan");
    });

    it("Should not allow flash loans with zero amount", async function () {
      await expect(
        tradingFunctions.connect(user1).flashLoan(vUSDC, 0)
      ).to.be.revertedWith("Amount must be greater than 0");
    });

    it("Should emit FlashLoan event", async function () {
      const flashLoanAmount = ethers.parseEther("100");
      const fee = flashLoanAmount * 1n / 1000n;
      
      await expect(tradingFunctions.connect(user1).flashLoan(vUSDC, flashLoanAmount))
        .to.emit(tradingFunctions, "FlashLoan")
        .withArgs(user1.address, vUSDC, flashLoanAmount, fee);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle unsupported tokens in all functions", async function () {
      const unsupportedToken = "0x0000000000000000000000000000000000000004";
      
      await expect(
        tradingFunctions.connect(user1).buy(unsupportedToken, ethers.parseEther("1"))
      ).to.be.revertedWith("Token not supported");
      
      await expect(
        tradingFunctions.connect(user1).sell(unsupportedToken, ethers.parseEther("1"))
      ).to.be.revertedWith("Token not supported");
      
      await expect(
        tradingFunctions.connect(user1).stake(unsupportedToken, ethers.parseEther("1"))
      ).to.be.revertedWith("Token not supported");
      
      await expect(
        tradingFunctions.connect(user1).unstake(unsupportedToken, ethers.parseEther("1"))
      ).to.be.revertedWith("Token not supported");
      
      await expect(
        tradingFunctions.connect(user1).lend(unsupportedToken, ethers.parseEther("1"))
      ).to.be.revertedWith("Token not supported");
      
      await expect(
        tradingFunctions.connect(user1).swap(unsupportedToken, vUSDC, ethers.parseEther("1"))
      ).to.be.revertedWith("Token not supported");
      
      await expect(
        tradingFunctions.connect(user1).repay(unsupportedToken, ethers.parseEther("1"))
      ).to.be.revertedWith("Token not supported");
      
      await expect(
        tradingFunctions.connect(user1).flashLoan(unsupportedToken, ethers.parseEther("1"))
      ).to.be.revertedWith("Token not supported");
    });
  });
}); 