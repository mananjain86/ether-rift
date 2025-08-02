import coreAbi from './EtherRiftCore.json';
import tradingAbi from './TradingFunctions.json';
import achievementAbi from './AchievementToken.json';
import { BrowserProvider, Contract } from 'ethers';

const CORE_ABI = coreAbi.abi;
const TRADING_ABI = tradingAbi.abi;
const ACHIEVEMENT_ABI = achievementAbi.abi;

// Contract addresses - replace with your deployed contract addresses
const CORE_ADDRESS = '0xD23F0a7c55aF903884913cF5633Ccbae9eB66C8b';
const TRADING_ADDRESS = '0x5582fB1701aF7f58FE439bbD2Df6df5913562Aa6';
const ACHIEVEMENT_ADDRESS = '0xE9A1d35D542ca6C9a7e923c0497fce8B45E5D330';

// Dynamic contract initialization function for EtherRiftCore
export const getCoreContract = async () => {
  const walletAddress = localStorage.getItem('walletAddress');
  if (!window.ethereum || !walletAddress) {
    throw new Error("No wallet found or not connected");
  }
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new Contract(CORE_ADDRESS, CORE_ABI, signer);
};

// Dynamic contract initialization function for TradingFunctions
export const getTradingContract = async () => {
  const walletAddress = localStorage.getItem('walletAddress');
  if (!window.ethereum || !walletAddress) {
    throw new Error("No wallet found or not connected");
  }
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new Contract(TRADING_ADDRESS, TRADING_ABI, signer);
};

// Dynamic contract initialization function for AchievementToken
export const getAchievementContract = async () => {
  const walletAddress = localStorage.getItem('walletAddress');
  if (!window.ethereum || !walletAddress) {
    throw new Error("No wallet found or not connected");
  }
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new Contract(ACHIEVEMENT_ADDRESS, ACHIEVEMENT_ABI, signer);
};

// Helper function to get all contracts at once
export const getAllContracts = async () => {
  const walletAddress = localStorage.getItem('walletAddress');
  if (!window.ethereum || !walletAddress) {
    throw new Error("No wallet found or not connected");
  }
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  return {
    coreContract: new Contract(CORE_ADDRESS, CORE_ABI, signer),
    tradingFunctions: new Contract(TRADING_ADDRESS, TRADING_ABI, signer),
    achievementToken: new Contract(ACHIEVEMENT_ADDRESS, ACHIEVEMENT_ABI, signer)
  };
};