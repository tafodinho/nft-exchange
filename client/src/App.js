import React, { Component } from "react";
import MetaMaskOnboarding from '@metamask/onboarding'
import { NftSwapV4 } from '@traderxyz/nft-swap-sdk';
import { Web3Provider } from "@ethersproject/providers";
import { Alert } from "react-bootstrap";
import LoadingOverlay from 'react-loading-overlay';

import MyNFT from "./contracts/MyNFT.json";
import MyToken from "./contracts/MyToken.json";
import getWeb3 from "./getWeb3";

import ListNFTs from "./components/ListNFTs";
import NFTMarket from "./components/NFTMarket";
import TransferToken from "./components/TransferToken";
import TokensInfo from "./components/TokensInfo";


import "./App.scss";

const axios = require('axios');
const forwarderOrigin = 'http://localhost:9010';

class App extends Component {
  state = { 
    totalToken: 0, 
    totalNFT: 0, 
    web3: null, 
    accounts: null, 
    contracts: null, 
    connectState: null,
    curView: "listedNFTs",
    ownedNFTs: [],
    nftsOnSale: [],
    showAlert: false,
    alertMessage: "",
    showLoading: false
  };

  connectButton = React.createRef();

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const onboardButton = this.connectButton.current;
      console.log(onboardButton, onboardButton.baseURI);
      const { ethereum } = window;
      ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      ethereum.on("accountsChanged", () => {
        window.location.reload();
      });

      //Created check function to see if the MetaMask extension is installed
      const isMetaMaskInstalled = () => {
        //Have to check the ethereum binding on the window object to see if it's installed
        return Boolean(ethereum && ethereum.isMetaMask);
      };

      //We create a new MetaMask onboarding object to use in our app
      const onboarding = new MetaMaskOnboarding({ forwarderOrigin });

      //This will start the onboarding proccess
      const onClickInstall = () => {
        this.setState({connectState: 'Onboarding in progress'})
        onboardButton.disabled = true;
        //On this object we have startOnboarding which will start the onboarding process for our end user
        onboarding.startOnboarding();
      };

      const onClickConnect = async () => {
        
        const web3 = await getWeb3(this.connectButton);
        this.setState({connectState: 'Disconect', showLoading: true})
        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = MyNFT.networks[networkId];
        const instance = new web3.eth.Contract(
          MyNFT.abi,
          deployedNetwork && deployedNetwork.address,
        );

        const deployedNetwork1 = MyToken.networks[networkId];
        const instance1 = new web3.eth.Contract(
          MyNFT.abi,
          deployedNetwork1 && deployedNetwork1.address,
        );

        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        this.setState({ web3, accounts, contracts: {
                    ...this.state.contracts, 
                    MyNFTContract: instance, 
                    MyTokenContract: instance1 
                  } }, this.getAll);
      };

      const MetaMaskClientCheck = () => {
        //Now we check to see if Metmask is installed
        if (!isMetaMaskInstalled()) {
          //If it isn't installed we ask the user to click to install it
          // onboardButton.innerText = 'Click here to install MetaMask!';
          this.setState({connectState: 'Click here to install MetaMask!'})
          //When the button is clicked we call th is function
          onboardButton.onclick = onClickInstall;
          //The button is now disabled
          onboardButton.disabled = false;
        } else {
          //If MetaMask is installed we ask the user to connect to their wallet
          // onboardButton.innerText = 'Connect';
          this.setState({connectState: 'Connect wallet'})
          //When the button is clicked we call this function to connect the users MetaMask Wallet
          onboardButton.onclick = onClickConnect;
          
          //The button is now disabled
          onboardButton.disabled = false;
        }
      };

      MetaMaskClientCheck();

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  getAll = async () => {
    const { accounts, contracts, web3 } = this.state;
    console.log(contracts, web3.currentProvider.constructor.name);
    const address = web3.utils.toChecksumAddress(accounts[0]);
    const response = await contracts.MyNFTContract.methods.balanceOf(address).call();
    const response1 = await contracts.MyTokenContract.methods.balanceOf(address).call();
    this.loadNftsOnSale()
    this.getOwnerTokens()
    this.setState({ totalNFT: response, totalToken: response1, showLoading: false });
  };

  mintNFT = async (amount) => {
    const { accounts, contracts } = this.state;
    await contracts.MyNFTContract.methods.mint(parseInt(amount)).send({ from: accounts[0], gas: 150000 });
    this.getAll();
  }

  getOwnerTokens = async () => {
    const { accounts, contracts, web3 } = this.state;
    const address = web3.utils.toChecksumAddress(accounts[0]);
    const response = await contracts.MyNFTContract.methods.tokensOfOwner(address).call();
    console.log(response)
    this.setState({ownedNFTs: response, curView: "NFTs"})
    
  }

  mintTokens = async (amount) => {
    const { accounts, contracts, web3 } = this.state;
    await contracts.MyTokenContract.methods.mint(parseInt(amount)).send({from: accounts[0], gas: 150000});
    this.getAll();
  }

  loadNftsOnSale = async () => {
    const { accounts, contracts, web3 } = this.state;
    const baseURL = "https://sjv9oce4h2.execute-api.us-east-1.amazonaws.com/api"
    try {
      const response = await axios({
        baseURL: baseURL,
        method: 'GET',
        url: '/orders',
      });
      console.log(response);
      this.setState({nftsOnSale: response.data, curView: "listedNFTs"})
    } catch (error) {
      console.error(error);
    }
    
  }

  sellNftApiCall = async (amount, itemId) => {
    const { accounts, contracts, web3 } = this.state;
    this.setState({showLoading: true})
    const baseURL = "https://sjv9oce4h2.execute-api.us-east-1.amazonaws.com/api"
    const provider = new Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const CHAIN_ID = await web3.eth.net.getId();
    console.log("Selling...");
    const item = {
      nftTokenAddress: contracts.MyNFTContract._address,
      nftTokenId: itemId,
      nftTokenType: "ERC721",
      tokenAddress: contracts.MyTokenContract._address,
      tokenAmount: amount,
      tokenType: "ERC20",
      userAddress: accounts[0],
    }

    const MYNFT = {
      tokenAddress: item.nftTokenAddress,
      tokenId: item.nftTokenId,
      type: item.nftTokenType, // 'ERC721' or 'ERC1155'
    };

    const TOKEN = {
      tokenAddress: item.tokenAddress, // WETH contract address
      amount: item.tokenAmount, // 420 Wrapped-ETH (WETH is 18 digits)
      type: item.tokenType,
    };
    const nftSdk = new NftSwapV4(provider, signer, CHAIN_ID);
    await nftSdk.approveTokenOrNftByAsset(MYNFT, item.userAddress);
    const order = nftSdk.buildOrder(
      // I am offering an NFT (CryptoCoven #9757)
      MYNFT,
      // I will receive an ERC20 (5,000 of USDC)
      TOKEN,
      // My wallet address
      item.userAddress
    );
     
    const signedOrder = await nftSdk.signOrder(order);
     
    const postedOrder = await nftSdk.postOrder(signedOrder, CHAIN_ID);
    console.log("ORDER BOOK RESULT", postedOrder);
    try {
      const response = await axios({
        baseURL: baseURL,
        method: 'POST',
        url: '/order',
        data: item
      });
      this.getOwnerTokens()
      this.setState({showLoading: false, showAlert: true, alertMessage: "Nft placed in market"})
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }


  buyNftApiCall = async (order) => {
    const { accounts, web3 } = this.state;
    this.setState({showLoading: true})
    const provider = new Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const CHAIN_ID = await web3.eth.net.getId();
    console.log("Buying..");
    const nftSwap = new NftSwapV4(provider, signer, CHAIN_ID);
    // const tokens = web3.utils.toBN("0x"+(parseInt(order.tokenAmount)*10**18).toString(16));
    const TOKEN = {
      tokenAddress: order.tokenAddress, // WETH contract address
      amount: parseInt(order.tokenAmount), // 420 Wrapped-ETH (WETH is 18 digits)
      type: order.tokenType,
    };

    const orders = await nftSwap.getOrders({
      nftToken: order.nftTokenAddress,
      nftTokenId: order.nftTokenId,
      chainId: CHAIN_ID,
    });

    const foundOrder = orders.orders
    // Fill order :)
    console.log("FOUND ORDERS", foundOrder)
    await nftSwap.approveTokenOrNftByAsset(TOKEN, accounts[0]);
    try {
      const fillTx = await nftSwap.fillSignedOrder(foundOrder[0].order);
      const fillTxReceipt = await nftSwap.awaitTransactionHash(fillTx.hash);
      this.deleteOrder(order.id);
      this.setState({showLoading: false})
      this.loadNftsOnSale()
      console.log(`🎉 🥳 Order filled. TxHash: ${fillTxReceipt.transactionHash}`)
    } catch (error) {
      this.setState({showLoading: false});
      console.log(error)
    }
  }

  deleteOrder = async (id) => {
    const baseURL = "https://sjv9oce4h2.execute-api.us-east-1.amazonaws.com/api"
    try {
      const response = await axios({
        baseURL: baseURL,
        method: 'DELETE',
        url: `/order/${id}`,
      });
      this.setState({showAlert: true, alertMessage: "Dellete success"})
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }

  closeAlert = () => {
    this.setState({showAlert: !this.state.showAlert})
  }

  openTokenInfo = async () => {
    this.setState({curView: "tokensInfo"})
  }

  render() {
    let body = null;
    if (!this.state.web3) {
      body = <div>Loading Web3, accounts, and contract...</div>;
    } else {
      switch(this.state.curView) {
        case "NFTs": { 
            body = <ListNFTs 
            nftList={this.state.ownedNFTs}
            compList={this.state.nftsOnSale}
            sellNftApiCall={this.sellNftApiCall} 
            deleteOrder={this.deleteOrder} /> 
          break
        }
        case "listedNFTs": {
          body = <NFTMarket 
            nftList={this.state.nftsOnSale}
            compList={this.state.ownedNFTs}
            buyNftApiCall={this.buyNftApiCall} />
          break
        } 
        case "tokensInfo": {
          body = <TokensInfo  
            numberOfNfts={this.state.totalNFT}
            numberOfTokens={this.state.totalToken}
            mintNFT={this.mintNFT}
            mintTokens={this.mintTokens} 
            getOwnerTokens={this.getOwnerTokens} />
          break
        }
        case "transferTokens": {
          body = <TransferToken />
          break 
        }
      }
    }
    return (
      <LoadingOverlay
          active={this.state.showLoading}
          spinner
          text='Processing...' >
      <div className="App">
          <div className="header">
          {!!this.state.web3 &&<div className="left-header">
              <ul className="menu">
                <li className={`menu-item ${this.state.curView == "listedNFTs" ? "active" : ""}`} onClick={() => this.loadNftsOnSale()}>NFTs Market</li>
                <li className={`menu-item ${this.state.curView == "NFTs" ? "active" : ""}`} onClick={() => this.getOwnerTokens()}>My NFTs</li>
                <li className={`menu-item ${this.state.curView == "tokensInfo" ? "active" : ""}`} onClick={() => this.openTokenInfo()}>Tokens info</li>
              </ul>
            </div>}
            <Alert show={this.state.showAlert} variant="primary" onClose={() => this.closeAlert()} dismissible>
              {this.state.alertMessage}
            </Alert>
            <div className="right-header">
              <button id="connect-button" ref={this.connectButton}>{this.state.connectState}</button>
            </div>
          </div>
          <div className="content">
            {body}
          </div>
        
      </div>
      </LoadingOverlay>
    );
  }
}

export default App;
