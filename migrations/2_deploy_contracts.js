var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var MyNFT = artifacts.require("./MyNFT.sol");
var MyToken = artifacts.require("./MyToken.sol");

module.exports = function(deployer) {
  deployer.deploy(MyNFT).then(function() {
    return deployer.deploy(SimpleStorage).then(function() {
      return deployer.deploy(MyToken).then(function() {
        //
      });
    });
  });
};
