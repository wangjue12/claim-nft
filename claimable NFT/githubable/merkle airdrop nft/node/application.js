const express = require('express');
const fs = require('fs');
var querystring = require('querystring');
const { ethers } = require('ethers');
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')

const privateKey = '0xb0395ede22d3148562b6b562526001fb2fcb14c4324028c62904171d0036fd52';

    // 创建 ethers.js provider
    const provider = new ethers.JsonRpcProvider('https://goerli.infura.io/v3/c1af05de104c4d8a81d46c221867610c');

    const wallet = new ethers.Wallet(privateKey, provider);

    // 获取智能合约的 ABI（Application Binary Interface）
    const contractAbi =  // 替换为你的智能合约 ABI
    [
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
    // 获取智能合约的地址
    const contractAddress = '0x58481C8EbC43bFEF077C2Ca8aA5D4C71944DB2Ea'; // 替换为你的智能合约地址

    // 创建合约对象
    const contract = new ethers.Contract(contractAddress, contractAbi, wallet);


const app = express();
app.use(express.json());

app.post('/add', (req, res) => {
  const newValue = req.body.value; // 从请求的 JSON 数据中获取要添加的值
  
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    try {
      const jsonData = JSON.parse(data);
      jsonData.whitelist.push(newValue); // 将新值添加到 whitelist 数组
            
      const whitelist = jsonData.whitelist;
      const leafNodes = whitelist.map(addr => keccak256(addr));
      const merkletree = new MerkleTree(leafNodes, keccak256, {sortPairs: true});

      const rootHash = merkletree.getRoot().toString('hex');

      contract.setRootHash('0x' + rootHash);

      fs.writeFile('data.json', JSON.stringify(jsonData), 'utf8', (err) => {
        if (err) {
          console.error('Error writing JSON file:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        return res.status(200).json({ message: 'Value added successfully' });
      });


    } catch (error) {
      console.error('Error parsing JSON:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
 
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
