pragma solidity ^0.5.2;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

contract RoundLock {
    string _initialHand = "test";
    bytes _initialHandBytes = bytes(_initialHand);
    uint256 _initialHandPrice = getHandPrice(_initialHand);

    address constant TOKEN_ADDR = 0xD2D0F8a6ADfF16C2098101087f9548465EC96C98;
    address constant RECEIVER = 0x7A8D7dFd4d3DAD5FDf41d145AbD26D8cA05b3798;

    function getHandPrice(string memory _input) pure internal returns (uint256){
        uint256 number;
        bytes memory b = bytes(_input);
        for(uint i=0;i<b.length;i++){
            number = number + uint256(bytes32((b[i])));
        }
        return number;
    }

    function validHand(string memory _hand) view public returns (bool) {
        bytes memory _handBytes = bytes(_hand);
        if (_handBytes.length == _initialHandBytes.length){
            uint _handPrice = getHandPrice(_hand);
            return _handPrice == _initialHandPrice;
        }
    }

    function fullfill(string memory userHand) public {
        require(validHand(userHand));

        IERC20 token = IERC20(TOKEN_ADDR);
        uint balance = token.balanceOf(address(this));
        token.transfer(RECEIVER, balance);
    }
}
