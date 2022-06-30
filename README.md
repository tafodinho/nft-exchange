# Nft-Exchange

## Table of Contents
1. [General Info](#general-info)
2. [Technologies](#technologies)
3. [Installation](#installation)

### General Info
***
- Nft-Echange is n offchain NFT Market-place, where NFT's can be swaped for MYTN(which is and ERC20 token). 
Users can mint NFT tokens for free, Users can list those NFTs for sale and other Users who have the MyToken can 
fill those others to buy the NFT on sale. Users can also cancel NFT's that have been put on sale. Users Can also
mint MyToken for free.
- The deployed application can be found at (http://nft-exchange.s3-website-us-east-1.amazonaws.com)
- The smart contracts are deployed to the ropsten testnetwork 
- Signed orders are being saved on both the Ox order book and on a local order book hosted on my DynamoDb database on AWS
- All backend endpoints are build with NodeJs and aws Lamba(serverless) for reduced cost as well
as I hosted the static website on S3 which makes it even a lot more cheaper.
- Link to my backend code can be found at (https://github.com/tafodinho/nft-exchange-api)

### Screenshot
![Image text](https://www.united-internet.de/fileadmin/user_upload/Brands/Downloads/Logo_IONOS_by.jpg)
## Technologies
***
A list of technologies used within the project:
* [0x v4 Swap SDK](https://docs.swapsdk.xyz): Version 4 
* [ERC721A Standard](https://chiru-labs.github.io/ERC721A)
* [openzeppeling-solidity](https://github.com/OpenZeppelin/openzeppelin-contracts)
* [ReactJs](https://reactjs.org)
* [Truffle](https://trufflesuite.com/): Version 

## Installation
***
A little on how to deploy the smart contracts on a testnet like ropsten. 
NOTE: I already have a tesnet profile setup in my truffle config. To deploy 
using your account you will need to make some changes in the truffle config 
and create a .env file with a wallet MY_MNEMONIC
```
$ git clone git@github.com:tafodinho/nft-exchange.git
$ cd nft-exchange
$ npm install
$ truffle deploy --network ropsten
```

***
A little on how to run web server on your localhost. 
```
$ git clone git@github.com:tafodinho/nft-exchange.git
$ cd nft-exchange/client
$ npm install
$ npm start
```

