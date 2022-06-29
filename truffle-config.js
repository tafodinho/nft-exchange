const path = require("path");
const MNEMONIC = process.env.MY_MNEMONIC;
const API_KEY = 'a26cac34b94a4e1e89212139acce8524';
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  // contracts_directory: "../node_modules/",
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, `https://ropsten.infura.io/v3/${API_KEY}`)
      },
      network_id: 3,
      gas: 4000000,      //make sure this gas allocation isn't over 4M, which is the max
      networkCheckTimeoutnetworkCheckTimeout: 10000,
      timeoutBlocks: 200
    }
  },
  compilers: {
    solc: {
      version: "^0.8.4",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200   // Optimize for how many times you intend to run the code
        },
      },
    }
  }
};
