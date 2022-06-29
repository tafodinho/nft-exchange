// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;

import "./erc721a/contracts/extensions/ERC721AQueryable.sol";

contract MyNFT is ERC721AQueryable {
    address public owner;

    // error OnlyOwner(address owner);
    // modifier onlyOwner() {
    //   if(owner != msg.sender) revert OnlyOwner(msg.sender);
    //   _;
    // }
    
    constructor() ERC721A("MyNFT", "MYNFT") {
      owner = msg.sender;
    }

    function mint(uint256 quantity) external {
        // `_mint`'s second argument now takes in a `quantity`, not a `tokenId`.
        _mint(msg.sender, quantity);
    }
}