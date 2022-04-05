require("@nomiclabs/hardhat-waffle");

const dotenv = require("dotenv").config();
const { PROJECT_ID, PRIVATE_KEY } = process.env;

module.exports = {
  networks: {
    hardhat: {
      chaindId: 31337
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${PROJECT_ID}`,
      accounts: [PRIVATE_KEY]
    },
    mainnet: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${PROJECT_ID}`,
      accounts: [PRIVATE_KEY]
    }
  },
  solidity: "0.8.4",
};

