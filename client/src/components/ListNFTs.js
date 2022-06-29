// @flow
import * as React from 'react';

import { Button, Modal, Form } from 'react-bootstrap';

const generateColor = () => {
  const randomColor = Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0');
  return `#${randomColor}`;
};

const ListNFT = ({
  nftList, 
  compList,
  sellNftApiCall,
  deleteOrder
}) => {
  const [show, setShow] = React.useState(false);
  const [item, setItem] = React.useState('')
  
  const handleClose = () => setShow(false);
  const handleShow = (item) => {
    setShow(true);
    setItem(item)
  }
  const handleDelete = (item) => {
    deleteOrder(item.id)
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    handleClose();
    sellNftApiCall(event.target[1].value, item);
  }

  const itemGrid = nftList.map(item => {
      const color = generateColor();
      let sellText = "Sell NFT";
      const listedItem = compList.filter(e => e.nftTokenId === item);
      if(listedItem.length > 0) {
        return (
          <div class="col">
            <div className="nft-card-sell card" style={{background: color}}>
              <span>{item}</span>
              <div class="card-footer" 
                onClick={() => handleDelete(listedItem[0])} 
                style={{background: "grey"}} 
              >
                <h5 class="card-title">Cancel Sell</h5>
              </div>
            </div>
          </div>
        )
      }
      return (
        <div class="col">
          <div className="nft-card-sell card" style={{background: color}}>
            <span>{item}</span>
            <div class="card-footer" onClick={() => handleShow(item)}>
              <h5 class="card-title">Sell Item</h5>
            </div>
          </div>
        </div>
      )
  })

  return (
    <div className="list-nfts">
      <div className="row row-cols-4">
        {itemGrid}
      </div>
      <Modal show={show} onHide={handleClose}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Sell NFT #{item}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Enter Amount</Form.Label>
              <Form.Control type="number" placeholder="Enter amount of token to sell for" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Sell
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ListNFT;