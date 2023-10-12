import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "contracts/NFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WhiteListMerkleClaim is IERC721Receiver, Ownable {
    bytes32 public merkleRoot;
    address public tokenAdress;
    mapping(address => bool) public whitelistClaimed;


    // verify the provided _merkleProof
    function whitelistclaim(bytes32[] calldata _merkleProof) public{
        require(!whitelistClaimed[msg.sender], "address has already claimed.");

        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(MerkleProof.verify(_merkleProof, merkleRoot, leaf), "Invaild proof.");

        whitelistClaimed[msg.sender] = true;

        MyToken dropToken = MyToken(tokenAdress);
        // require(
        //     dropToken.balanceOf(address(this)) > 0,
        //     "Insufficient balance"
        // );
        dropToken.safeMint(msg.sender);

    }


    function setRootHash(bytes32 roothash_) external onlyOwner{
        merkleRoot = roothash_;
    }

    function settokenAdress(address tokenAdress_) external onlyOwner{
        tokenAdress = tokenAdress_;
    }

    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data)
        external
        override
        returns (bytes4)
    {
        return this.onERC721Received.selector;
    }

}
