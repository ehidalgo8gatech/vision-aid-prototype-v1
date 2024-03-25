import { Modal as ReactModal, Button } from 'react-bootstrap';

/**
 * Defines a reusable modal component
 * @param {*} props 
 */
export default function Modal(props) {
  const { title, closeText, submitText, open, handleOnClose, handleOnSubmit, children } = props;

  return (
    <ReactModal show={open} onHide={handleOnClose} size="lg">
      <ReactModal.Header closeButton>
        <ReactModal.Title style={{ textAlign: 'left' }}>
          {title}
        </ReactModal.Title>
      </ReactModal.Header>
      <ReactModal.Body>
        {children}
      </ReactModal.Body>
      <ReactModal.Footer>
        <Button variant="secondary" onClick={handleOnClose}>
          { closeText || "Close" }
        </Button>
        <Button variant="primary" onClick={handleOnSubmit}>
          { submitText || "Submit" }
        </Button>
      </ReactModal.Footer>
    </ReactModal>
  );
}
