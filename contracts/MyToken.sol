// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;

import "./openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20 ("MyToken", "MYTOKEN") {}

    function mint(uint256 amount) external {
      _mint(msg.sender, amount);
    }
}