// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin-contracts/token/ERC721/ERC721.sol";
import "@openzeppelin-contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract UselessNFT is ERC721, ERC721Enumerable {
    constructor() ERC721("NFT", "USELESS") {}

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _increaseBalance(address account, uint128 amount) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, amount);
    }

    function _update(address to, uint256 tokenId, address auth) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function mint() external {
        _mint(msg.sender, super.totalSupply());
    }
}