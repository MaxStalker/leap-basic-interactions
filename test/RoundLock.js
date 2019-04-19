const chai = require("chai");
const should = chai.use(require("chai-as-promised")).should();

const RoundLock = artifacts.require("RoundLock");

contract("RoundLock", accounts => {
  it("should put 10000 MetaCoin in the first account", () =>
    RoundLock.deployed()
      .then(instance => instance.validHandString.call("test"))
      .then(valid => {
        assert.equal(
          valid,
          true,
          "all cool"
        );
      }));
});
