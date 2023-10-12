// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;

    struct NFT {
        uint256 level;
    }
    NFT[] public nfts;
    mapping(address => uint256[]) private _ownedTokens;

    constructor() ERC721("MyNFT", "NFT") {}

    function mint(address to, uint256 _level) public returns (uint256) {
        uint256 newTokenId = _tokenIds.current();
        NFT memory newNFT = NFT(_level);
        nfts.push(newNFT);
        _mint(to, newTokenId);
        _ownedTokens[to].push(newTokenId);
        _tokenIds.increment();
        return newTokenId;
    }

    function getNFTLevel(uint256 tokenId) external view returns (uint256) {
        require(_exists(tokenId), "Invalid tokenId");
        return nfts[tokenId].level;
    }


    function balanceOf(address owner) public view override returns (uint256) {
        require(owner != address(0), "Invalid owner address");
        return _ownedTokens[owner].length;
    }

    function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256) {
        require(index < balanceOf(owner), "Invalid token index");
        return _ownedTokens[owner][index];
    }

    function _transfer(address from, address to, uint256 tokenId) internal override {
        super._transfer(from, to, tokenId);
        uint256[] storage fromTokens = _ownedTokens[from];
        uint256[] storage toTokens = _ownedTokens[to];
        for (uint256 i = 0; i < fromTokens.length; i++) {
            if (fromTokens[i] == tokenId) {
                fromTokens[i] = fromTokens[fromTokens.length - 1];
                fromTokens.pop();
                break;
            }
        }
        toTokens.push(tokenId);
    }

    function _mint(address to, uint256 tokenId) internal override {
        super._mint(to, tokenId);
    }
}
