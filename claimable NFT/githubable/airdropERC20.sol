import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WhiteListMerkle is Ownable{
    bytes32 public merkleRoot;
    address public tokenAdress;
    using SafeERC20 for IERC20;
    mapping(address => bool) public whitelistClaimed;

    // verify the provided _merkleProof
    function whitelist(bytes32[] calldata _merkleProof ,uint256 _amount) public{
        require(!whitelistClaimed[msg.sender], "address has already claimed.");

        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(MerkleProof.verify(_merkleProof, merkleRoot, leaf), "Invaild proof.");

        whitelistClaimed[msg.sender] = true;

        IERC20 dropToken = IERC20(tokenAdress);
        require(
            dropToken.balanceOf(address(this)) >= _amount,
            "Insufficient balance"
        );
        dropToken.safeTransfer(msg.sender, _amount);

    }

    function settokenAdress(address tokenAdress_) external onlyOwner{
        tokenAdress = tokenAdress_;
    }

    function setRootHash(bytes32 roothash_) external {
        merkleRoot = roothash_;
    }
}
