require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy")


const RINKEYBY_RPC_URL = process.env.RINKEYBY_RPC_URL || ""
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // solidity: "0.8.9",
  solidity: {
    compilers: [
      {version: "0.8.8"}, {version: "0.6.6"}
    ]
  },
  defaultNetwork: "hardhat",
  networks: {
    rinkeby: {
      url: RINKEYBY_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 4, 
      blockConfirmations: 6
    }
  },
  gasReporter: {
    enabled: false,
    outputFile: "gas-report.txt",
    noColors: true, 
    currency: "USD",
    coinmarketcap: COINMARKETCAP_API_KEY,
    token: "MATIC"
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
  namedAccounts: {
    deployer: {
      default: 0,
    }, 
    user: {
      default: 1,
    }
  }
};
