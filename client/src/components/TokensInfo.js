// @flow
import * as React from 'react';
import { 
  Button,
  Form,
  Modal,
} from 'react-bootstrap';

const TokensInfo = ({
  numberOfNfts, 
  numberOfTokens,
  mintTokens,
  mintNFT,
}) => {
  const [showTokenModal, setShowTokenModal] = React.useState(false);
  const [showNftModal, setShowNftModal] = React.useState(false);

  const handleCloseToken = () => setShowTokenModal(false);
  const handleCloseNft = () => setShowNftModal(false);
  const handleShowToken = () => setShowTokenModal(true);
  const handleShowNft = () => setShowNftModal(true);

  const handleSubmitNft = (event) => {
    event.preventDefault();
    handleCloseNft();
    // sellNftApiCall(event.target[1].value, item);
    mintNFT(event.target[1].value);
  }

  const handleSubmitToken = (event) => {
    event.preventDefault();
    handleCloseToken();
    // sellNftApiCall(event.target[1].value, item);
    mintTokens(event.target[1].value);
  }

  return (
    <div className="tokens-info">
      <div>Total NFT's owned: {numberOfNfts}</div>
      <div>Total Number of MyToken's owned: {numberOfTokens}</div>
      <Button variant="primary" size="lg" className="mint-nft-button" onClick={handleShowNft}>Mint NFT's</Button>
      <Button variant="primary" size="lg" className="mint-token-button" onClick={handleShowToken}>Mint MyTokens</Button>

      <Modal show={showNftModal} onHide={handleCloseNft}>
        <Form onSubmit={handleSubmitNft}>
          <Modal.Header closeButton>
            <Modal.Title>Request For NFT's </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Enter Amount</Form.Label>
              <Form.Control type="number" placeholder="Enter amount of nfts you want" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseNft}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Mint
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showTokenModal} onHide={handleCloseToken}>
        <Form onSubmit={handleSubmitToken}>
          <Modal.Header closeButton>
            <Modal.Title>Request For MyToken</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Enter Amount</Form.Label>
              <Form.Control type="number" placeholder="Enter amount of MyTokens you want" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseToken}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Mint
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default TokensInfo;