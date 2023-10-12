
// 定义 NFT 合约地址和 ABI（根据你的实际情况进行修改）
const contractAddress = '0x58481C8EbC43bFEF077C2Ca8aA5D4C71944DB2Ea';
const contractABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "merkleRoot",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "onERC721Received",
        "outputs": [
            {
                "internalType": "bytes4",
                "name": "",
                "type": "bytes4"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "roothash_",
                "type": "bytes32"
            }
        ],
        "name": "setRootHash",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "tokenAdress_",
                "type": "address"
            }
        ],
        "name": "settokenAdress",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "tokenAdress",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "whitelistClaimed",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32[]",
                "name": "_merkleProof",
                "type": "bytes32[]"
            }
        ],
        "name": "whitelistclaim",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// 创建 MetaMask 钱包连接
async function connectWallet() {
  if (window.ethereum) {
    try {
      // 请求用户授权连接钱包
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('已连接 MetaMask 钱包');

      // 创建 ethers.js 的以太坊提供者
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // 获取用户的钱包地址
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      console.log('钱包地址:', address);

      // 铸造 NFT
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      fetch('data.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const whitelist = data.whitelist;
        console.log('Whitelist:', whitelist);

        const leafNodes = whitelist.map(addr => keccak256(addr));
        const merkletree = new MerkleTree(leafNodes, keccak256, {sortPairs: true});
        console.log(merkletree);

        const hash = keccak256(address).toString('hex');
        const hexProof = merkletree.getHexProof(hash);

        console.log(hexProof);
        contract.whitelistclaim(hexProof);

        console.log('已完成 NFT 铸造');

      })
      .catch(error => {
        console.error('Error:', error);
      });
    
    } catch (error) {
      console.error('连接钱包或铸造 NFT 时出错:', error);
    }
  } else {
    console.error('未检测到 MetaMask 钱包');
  }
}

//调用连接钱包函数
// connectWallet();
