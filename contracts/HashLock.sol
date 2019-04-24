pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";


contract HashLock {
    bytes32 constant COND_HASH = 0x4131413141314431443100000000000000000000000000000000000000000000;

    address constant TOKEN_ADDR = 0xD2D0F8a6ADfF16C2098101087f9548465EC96C98;
    address constant RECEIVER = 0xBbebEa9812971a5C2B7d99a99E7d8b4d5Fda7091;

    function roundResult (bytes32 _answer) public {
        require(_answer == COND_HASH);

        IERC20 token = IERC20(TOKEN_ADDR);
        uint balance = token.balanceOf(address(this));

        token.transfer(RECEIVER, balance);
    }
}
