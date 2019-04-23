pragma solidity ^0.5.2;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

contract SimpleLock{

    address constant TOKEN_ADDR = 0xD2D0F8a6ADfF16C2098101087f9548465EC96C98;
    address constant RECEIVER = 0x1111111111111111111111111111111111111111;

    function resolve() public{
        IERC20 token = IERC20(TOKEN_ADDR);
        uint balance = token.balanceOf(address(this));

        token.transfer(RECEIVER, balance);
    }
}