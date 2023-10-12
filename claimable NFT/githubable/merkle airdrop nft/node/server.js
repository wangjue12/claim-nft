var http = require('http');
var querystring = require('querystring');
const { ethers } = require('ethers');
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const fs = require('fs');

var proof ;
var rootHash;
var postHTML = 
  '<html><head><meta charset="utf-8"><title>merkle</title></head>' +
  '<body>' +
  '<form method="post">' +
  'address： <input name="address"><br>' +
  'merkle proof： <input name="proof"><br>' +
  '<input type="submit">' +
  '</form>' +
  '</body></html>';
 
http.createServer(function (req, res) {
  var body = "";
  req.on('data', function (chunk) {
    body += chunk;
  });
  req.on('end', function () {
    // 解析参数
    body = querystring.parse(body);
    // 设置响应头部信息及编码
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
 
    if(body.address) { // 输出提交的数据
        res.write("address：" + body.address);

        res.write("<br>");
        res.write("<br>");

    // 读取 JSON 文件
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        try {
          // 解析 JSON 数据
          const jsonData = JSON.parse(data);
      
          const whitelist = jsonData.whitelist;
          const leafNodes = whitelist.map(addr => keccak256(addr));
          const merkletree = new MerkleTree(leafNodes, keccak256, {sortPairs: true});

          rootHash = merkletree.getRoot().toString('hex');
            
        //   console.log("rootHash is: ", rootHash);
      
          console.log("--------verify------------");
          const address = body.address;

          console.log("address is: ", address);

          const hash = keccak256(address).toString('hex');
          const hexProof = merkletree.getHexProof(hash);

          console.log(hexProof);

          proof = hexProof;

          console.log("rootHash is: ", rootHash);

        } catch (err) {
          console.error('Error parsing JSON:', err);
        }
      });

      res.write("merkle proof：" + proof);

      res.write("<br>");
      res.write("<br>");

      res.write("roothash: " + rootHash);

    } else {  // 输出表单
        res.write(postHTML);
    }
    res.end();
  });
}).listen(3001);