import coreAbi from './EtherRiftCore.json';
import tradingAbi from './TradingFunctions.json';
import achievementAbi from './AchievementToken.json';
import { BrowserProvider, Contract } from 'ethers';

const CORE_ABI = coreAbi.abi;
const TRADING_ABI = tradingAbi.abi;
const ACHIEVEMENT_ABI = achievementAbi.abi;

// Contract addresses - replace with your deployed contract addresses
const CORE_ADDRESS = '0x06db914d18dDf5C4e40aB808026bc5f5e768F9d6';
const TRADING_ADDRESS = '0x7E90Fd44304177DBa8cc22373A9298766E8e2448';
const ACHIEVEMENT_ADDRESS = '0xfE64EC7eaaeE7C8b9F7D00a14E67085c4153f55b';

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