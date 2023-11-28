// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

error SoulBoundToken();

contract SBT is ERC721A, Ownable {
    string private _metadataBaseUri;
    mapping(address => bool) public allowed;

    constructor(
        string memory name,
        string memory symbol,
        string memory setBaseUri
    ) ERC721A(name, symbol) {
        _metadataBaseUri = setBaseUri;
        allowed[msg.sender] = true;
    }

    function _baseURI() internal view override returns (string memory) {
        return _metadataBaseUri;
    }

    function baseURI() public view virtual returns (string memory) {
        return _baseURI();
    }

    function mint(uint256 quantity) external payable onlyOwner {
        _mint(msg.sender, quantity);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public payable virtual override {
        if (!allowed[from]) {
            revert SoulBoundToken();
        }
        super.transferFrom(from, to, tokenId);
    }
}
