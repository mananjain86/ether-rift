import coreAbi from './EtherRiftCore.json';
import tradingAbi from './TradingFunctions.json';
import achievementAbi from './AchievementToken.json';
import { BrowserProvider, Contract } from 'ethers';

const CORE_ABI = coreAbi.abi;
const TRADING_ABI = tradingAbi.abi;
const ACHIEVEMENT_ABI = achievementAbi.abi;

// Contract addresses - replace with your deployed contract addresses
const CORE_ADDRESS = '0x4aCEC9EED63C4A2C5Bc31f1174FAef2ea3af7DA5';
const TRADING_ADDRESS = '0x98b1b9Dcb2F5ee6f505a92F52B7f7e00ba6Aa375';
const ACHIEVEMENT_ADDRESS = '0x3700fE43D3988AeEb2025605c1A9745f77014a6a';

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