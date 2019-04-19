pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

contract RoundLock {

    // "A-A-D-M-M" = "M-M-A-D-D"
    // "A3D1M4V0" <=> "D4.."

    string _initialHand = "test"; // this should be hex
    bytes _initialHandBytes = bytes(_initialHand);
    uint256 _initialHandPrice = getHandPrice(_initialHandBytes);

    address constant TOKEN_ADDR = 0xD2D0F8a6ADfF16C2098101087f9548465EC96C98;
    address constant RECEIVER = 0xD8536F0dF61CD496B78e336b7Fe5e8bDFF45CD2f;

    function getHandPrice(bytes memory b) pure internal returns (uint256){
        uint256 number;
        for (uint i = 0; i < b.length; i++) {
            number = number + uint256(bytes32((b[i])));
        }
        return number;
    }

    function validHandString(string memory _hand) view public returns (bool) {
        bytes memory _handBytes = bytes(_hand);
        if (_handBytes.length == _initialHandBytes.length) {
            uint _handPrice = getHandPrice(_handBytes);
            return _handPrice == _initialHandPrice;
        }
    }

    function validHand(bytes memory _handBytes) view public returns (bool) {
        if (_handBytes.length == _initialHandBytes.length) {
            uint _handPrice = getHandPrice(_handBytes);
            return _handPrice == _initialHandPrice;
        }
    }

    // this can be any name
    function roundResult(string memory userHand) public {
        require(msg.sender == RECEIVER, "not a receiver");
        // we can skip encoding here
        require(validHand(abi.encodePacked(userHand)));
        // calculation
        IERC20 token = IERC20(TOKEN_ADDR);

        uint balance = token.balanceOf(address(this));
        // transferFrom
        token.transfer(RECEIVER, balance);
        //token.transfer(HOUSE, rest);
    }

    // add cancel to cancel the round
    function cancel() public{
        // Create cancel functionality
        // address HOUSE = 0xD8536F0dF61CD496B78e336b7Fe5e8bDFF45CD2f;
        // require(msg.sender == HOUSE);
    }
}
