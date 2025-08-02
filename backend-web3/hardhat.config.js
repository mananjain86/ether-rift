require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "etherlinkTestnet",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    etherlinkTestnet: {
      url: process.env.PROVIDER_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  solidity: {
    version: "0.8.24", // Adjust the version as needed
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};