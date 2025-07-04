require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: 
  {
    version: "0.8.20",
    settings:
    {
      optimizer:
      {
        enabled: true,
        runs: 2,
      }
    }
  },
  defaultNetwork: "hardhat",
  networks: {
    local: {
      url: "http://127.0.0.1:8545"
    },
    hardhat:
    {
    }
  }
};
