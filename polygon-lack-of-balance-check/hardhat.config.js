require("@nomiclabs/hardhat-waffle");


require("dotenv").config();

const BLOCK_NUMBER = 2156659; 
const URL = `https://polygon-mainnet.infura.io/v3/${process.env.POLYGON_INFURA_KEY}`;

module.exports = {
  solidity: "0.5.11", 

    networks: {
    hardhat: {
      forking: {
        url: URL,
        blockNumber: BLOCK_NUMBER
      },
    }
  }
};
