import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "contracts/testnft1.sol";

contract claim is Ownable{

    address public tokenAdress;
    uint256 public rate = 20;
    mapping(address => uint256) public _ownedRate;

    function settokenAdress(address tokenAdress_) external onlyOwner{
        tokenAdress = tokenAdress_;
    }

    function setRate(uint256 rate_) external onlyOwner{
        rate = rate_;
    }

        // verify the provided _merkleProof
    function claimfeeRate() public {

        MyNFT dropToken = MyNFT(tokenAdress);
        uint256 balance = dropToken.balanceOf(msg.sender);
        if (balance == 0){
            _ownedRate[msg.sender] = rate;
        }else{
        
            uint256 tokenId = dropToken.tokenOfOwnerByIndex(msg.sender,0);
            uint256 level = dropToken.getNFTLevel(tokenId);
            if(level == 1){
                _ownedRate[msg.sender] = rate - 5;
            }else if(level == 2){
                _ownedRate[msg.sender] = rate - 10;
            }else{
                _ownedRate[msg.sender] = rate - 20;
            }
        }
    }
}