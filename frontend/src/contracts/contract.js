import { ethers } from 'ethers';
import EtherRiftCore from './EtherRiftCore.json';
import TradingFunctions from './TradingFunctions.json';
import AchievementToken from './AchievementToken.json';

// Contract addresses (update these with your deployed contract addresses)
const CONTRACT_ADDRESSES = {
  CORE: '0x06db914d18dDf5C4e40aB808026bc5f5e768F9d6', // EtherRiftCore
  TRADING: '0x7E90Fd44304177DBa8cc22373A9298766E8e2448', // TradingFunctions
  ACHIEVEMENT: '0xfE64EC7eaaeE7C8b9F7D00a14E67085c4153f55b' // AchievementToken
};

// Token addresses
const TOKEN_ADDRESSES = {
  vETH: '0x0000000000000000000000000000000000000001',
  vUSDC: '0x0000000000000000000000000000000000000002',
  vDAI: '0x0000000000000000000000000000000000000003',
  ERA: '0x0000000000000000000000000000000000000004'
};

// Get provider and signer
const getProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  throw new Error('No Ethereum provider found');
};

const getSigner = async () => {
  const provider = getProvider();
  return await provider.getSigner();
};

// Core Contract Functions
export const getCoreContract = async () => {
  try {
    const signer = await getSigner();
    return new ethers.Contract(CONTRACT_ADDRESSES.CORE, EtherRiftCore.abi, signer);
  } catch (error) {
    console.error('Error getting core contract:', error);
    throw error;
  }
};

// Trading Contract Functions
export const getTradingContract = async () => {
  try {
    const signer = await getSigner();
    return new ethers.Contract(CONTRACT_ADDRESSES.TRADING, TradingFunctions.abi, signer);
  } catch (error) {
    console.error('Error getting trading contract:', error);
    throw error;
  }
};

// Achievement Contract Functions
export const getAchievementContract = async () => {
  try {
    const signer = await getSigner();
    return new ethers.Contract(CONTRACT_ADDRESSES.ACHIEVEMENT, AchievementToken.abi, signer);
  } catch (error) {
    console.error('Error getting achievement contract:', error);
    throw error;
  }
};

// User Registration Functions
export const registerUser = async (walletAddress) => {
  try {
    console.log('registerUser called with walletAddress:', walletAddress);
    const coreContract = await getCoreContract();
    const tx = await coreContract.register();
    const receipt = await tx.wait();
    console.log('User registered successfully:', receipt);
    return receipt;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const checkUserRegistration = async (walletAddress) => {
  try {
    console.log('checkUserRegistration called with walletAddress:', walletAddress);
    const coreContract = await getCoreContract();
    const playerInfo = await coreContract.getPlayerInfo(walletAddress);
    console.log('User registration status:', playerInfo.isRegistered);
    return playerInfo.isRegistered;
  } catch (error) {
    console.error('Error checking user registration:', error);
    return false;
  }
};

// Token Balance Functions
export const getUserBalance = async (walletAddress, tokenAddress) => {
  try {
    console.log('getUserBalance called with walletAddress:', walletAddress, 'tokenAddress:', tokenAddress);
    const coreContract = await getCoreContract();
    const balance = await coreContract.getUserBalance(walletAddress, tokenAddress);
    const formattedBalance = parseFloat(ethers.formatEther(balance));
    console.log('User balance:', formattedBalance);
    return formattedBalance;
  } catch (error) {
    console.error('Error getting user balance:', error);
    throw error;
  }
};

export const getAllUserBalances = async (walletAddress) => {
  try {
    console.log('getAllUserBalances called with walletAddress:', walletAddress);
    const balances = {};
    
    for (const [tokenName, tokenAddress] of Object.entries(TOKEN_ADDRESSES)) {
      try {
        balances[tokenName] = await getUserBalance(walletAddress, tokenAddress);
      } catch (error) {
        console.error(`Error getting balance for ${tokenName}:`, error);
        balances[tokenName] = 0;
      }
    }
    
    console.log('All user balances:', balances);
    return balances;
  } catch (error) {
    console.error('Error getting all user balances:', error);
    throw error;
  }
};

// Trading Functions
export const swapTokens = async (fromToken, toToken, amount) => {
  try {
    console.log('swapTokens called with fromToken:', fromToken, 'toToken:', toToken, 'amount:', amount);
    const tradingContract = await getTradingContract();
    const tx = await tradingContract.swap(fromToken, toToken, ethers.parseEther(amount.toString()));
    const receipt = await tx.wait();
    console.log('Swap completed successfully:', receipt);
    return receipt;
  } catch (error) {
    console.error('Error swapping tokens:', error);
    throw error;
  }
};

export const stakeTokens = async (tokenAddress, amount) => {
  try {
    console.log('stakeTokens called with tokenAddress:', tokenAddress, 'amount:', amount);
    const tradingContract = await getTradingContract();
    const tx = await tradingContract.stake(tokenAddress, ethers.parseEther(amount.toString()));
    const receipt = await tx.wait();
    console.log('Staking completed successfully:', receipt);
    return receipt;
  } catch (error) {
    console.error('Error staking tokens:', error);
    throw error;
  }
};

export const unstakeTokens = async (tokenAddress, amount) => {
  try {
    console.log('unstakeTokens called with tokenAddress:', tokenAddress, 'amount:', amount);
    const tradingContract = await getTradingContract();
    const tx = await tradingContract.unstake(tokenAddress, ethers.parseEther(amount.toString()));
    const receipt = await tx.wait();
    console.log('Unstaking completed successfully:', receipt);
    return receipt;
  } catch (error) {
    console.error('Error unstaking tokens:', error);
    throw error;
  }
};

export const provideLiquidity = async (tokenA, tokenB, amountA, amountB) => {
  try {
    console.log('provideLiquidity called with tokenA:', tokenA, 'tokenB:', tokenB, 'amountA:', amountA, 'amountB:', amountB);
    const tradingContract = await getTradingContract();
    const tx = await tradingContract.provideLiquidity(
      tokenA, 
      tokenB, 
      ethers.parseEther(amountA.toString()), 
      ethers.parseEther(amountB.toString())
    );
    const receipt = await tx.wait();
    console.log('Liquidity provided successfully:', receipt);
    return receipt;
  } catch (error) {
    console.error('Error providing liquidity:', error);
    throw error;
  }
};

export const removeLiquidity = async (tokenA, tokenB, amount) => {
  try {
    console.log('removeLiquidity called with tokenA:', tokenA, 'tokenB:', tokenB, 'amount:', amount);
    const tradingContract = await getTradingContract();
    const tx = await tradingContract.removeLiquidity(
      tokenA, 
      tokenB, 
      ethers.parseEther(amount.toString())
    );
    const receipt = await tx.wait();
    console.log('Liquidity removed successfully:', receipt);
    return receipt;
  } catch (error) {
    console.error('Error removing liquidity:', error);
    throw error;
  }
};

export const flashLoan = async (tokenAddress, amount) => {
  try {
    console.log('flashLoan called with tokenAddress:', tokenAddress, 'amount:', amount);
    const tradingContract = await getTradingContract();
    const tx = await tradingContract.flashLoan(tokenAddress, ethers.parseEther(amount.toString()));
    const receipt = await tx.wait();
    console.log('Flash loan completed successfully:', receipt);
    return receipt;
  } catch (error) {
    console.error('Error executing flash loan:', error);
    throw error;
  }
};

export const lendTokens = async (tokenAddress, amount) => {
  try {
    console.log('lendTokens called with tokenAddress:', tokenAddress, 'amount:', amount);
    const tradingContract = await getTradingContract();
    const tx = await tradingContract.lend(tokenAddress, ethers.parseEther(amount.toString()));
    const receipt = await tx.wait();
    console.log('Lending completed successfully:', receipt);
    return receipt;
  } catch (error) {
    console.error('Error lending tokens:', error);
    throw error;
  }
};

export const borrowTokens = async (borrowToken, borrowAmount, collateralToken, collateralAmount) => {
  try {
    console.log('borrowTokens called with borrowToken:', borrowToken, 'borrowAmount:', borrowAmount, 'collateralToken:', collateralToken, 'collateralAmount:', collateralAmount);
    const tradingContract = await getTradingContract();
    const tx = await tradingContract.borrow(
      borrowToken,
      ethers.parseEther(borrowAmount.toString()),
      collateralToken,
      ethers.parseEther(collateralAmount.toString())
    );
    const receipt = await tx.wait();
    console.log('Borrowing completed successfully:', receipt);
    return receipt;
  } catch (error) {
    console.error('Error borrowing tokens:', error);
    throw error;
  }
};

export const repayTokens = async (tokenAddress, amount) => {
  try {
    console.log('repayTokens called with tokenAddress:', tokenAddress, 'amount:', amount);
    const tradingContract = await getTradingContract();
    const tx = await tradingContract.repay(tokenAddress, ethers.parseEther(amount.toString()));
    const receipt = await tx.wait();
    console.log('Repayment completed successfully:', receipt);
    return receipt;
  } catch (error) {
    console.error('Error repaying tokens:', error);
    throw error;
  }
};

export const yieldFarm = async (tokenAddress, amount) => {
  try {
    console.log('yieldFarm called with tokenAddress:', tokenAddress, 'amount:', amount);
    const tradingContract = await getTradingContract();
    const tx = await tradingContract.yieldFarm(tokenAddress, ethers.parseEther(amount.toString()));
    const receipt = await tx.wait();
    console.log('Yield farming completed successfully:', receipt);
    return receipt;
  } catch (error) {
    console.error('Error yield farming:', error);
    throw error;
  }
};

export const vote = async (proposalId, support) => {
  try {
    console.log('vote called with proposalId:', proposalId, 'support:', support);
    const tradingContract = await getTradingContract();
    const tx = await tradingContract.vote(proposalId, support);
    const receipt = await tx.wait();
    console.log('Vote completed successfully:', receipt);
    return receipt;
  } catch (error) {
    console.error('Error voting:', error);
    throw error;
  }
};

// Achievement Functions
export const mintAchievementTokens = async (walletAddress, amount) => {
  try {
    console.log('🏆 Starting achievement token minting process...');
    console.log('👤 Wallet address:', walletAddress);
    console.log('💰 Amount to mint:', amount);
    
    // Check if user is registered first
    const isRegistered = await checkUserRegistration(walletAddress);
    console.log('🔍 User registration status:', isRegistered);
    
    if (!isRegistered) {
      console.log('⚠️ User not registered, attempting to register first...');
      await registerUserContract(walletAddress);
      console.log('✅ User registered successfully');
    }
    
    const coreContract = await getCoreContract();
    console.log('📋 Core contract obtained successfully');
    console.log('📝 Calling unlockAchievement on core contract...');
    
    const tx = await coreContract.unlockAchievement(walletAddress, 'milestone-completion', ethers.parseEther(amount.toString()));
    console.log('⏳ Transaction sent, waiting for confirmation...');
    console.log('📄 Transaction hash:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('✅ Transaction confirmed! Achievement tokens minted successfully');
    console.log('🎉 Achievement token minting process completed!');
    console.log('📋 Transaction receipt:', receipt);
    
    return receipt;
  } catch (error) {
    console.error('❌ Error minting achievement tokens:', error);
    console.error('🔍 Error details:', {
      message: error.message,
      code: error.code,
      walletAddress: walletAddress,
      amount: amount
    });
    throw error;
  }
};

export const getAchievementTokenBalance = async (walletAddress) => {
  try {
    console.log('getAchievementTokenBalance called with walletAddress:', walletAddress);
    const achievementContract = await getAchievementContract();
    const balance = await achievementContract.balanceOf(walletAddress);
    const formattedBalance = parseFloat(ethers.formatEther(balance));
    console.log('Achievement token balance:', formattedBalance);
    return formattedBalance;
  } catch (error) {
    console.error('Error getting achievement token balance:', error);
    throw error;
  }
};

// Guestbook Functions - This is a simulation since no real guestbook function exists
export const signGuestbook = async (walletAddress) => {
  try {
    console.log('signGuestbook called with walletAddress:', walletAddress);
    // Since there's no actual guestbook function in the contract,
    // we'll simulate it by recording a trade
    const coreContract = await getCoreContract();
    const tx = await coreContract.recordTrade('guestbook-sign', ethers.parseEther('0'));
    const receipt = await tx.wait();
    console.log('Guestbook signed successfully:', receipt);
    return receipt;
  } catch (error) {
    console.error('Error signing guestbook:', error);
    throw error;
  }
};

// Utility Functions
export const getTokenAddress = (tokenName) => {
  return TOKEN_ADDRESSES[tokenName] || TOKEN_ADDRESSES.vETH;
};

export const getTokenName = (tokenAddress) => {
  for (const [name, address] of Object.entries(TOKEN_ADDRESSES)) {
    if (address.toLowerCase() === tokenAddress.toLowerCase()) {
      return name;
    }
  }
  return 'Unknown';
};

// Contract Addresses for external use
export { CONTRACT_ADDRESSES, TOKEN_ADDRESSES };