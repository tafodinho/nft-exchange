// @flow
import * as React from 'react';

const generateColor = () => {
  const randomColor = Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0');
  return `#${randomColor}`;
};

const  NFTMarket = ({nftList, buyNftApiCall}) => {
  const itemGrid = nftList.map(item => {
    const color = generateColor();
    return <div class="col">
        <div className="nft-card-buy card" style={{background: color}}>
          <span>{item.nftTokenId}</span>
          <p>price: {item.tokenAmount} MYT</p>
          <div class="card-footer" onClick={() => buyNftApiCall(item)}>
            <h5 class="card-title">Buy NFT </h5>
          </div>
        </div>
      </div>
  })

  return (
    <div className="list-nfts">
      <div className="row row-cols-4">
        {itemGrid}
      </div>
    </div>
  );
};

export default NFTMarket;