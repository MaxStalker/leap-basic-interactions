var MyContract = artifacts.require("AdvancedLock");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(MyContract);
};