import React from "react";
import { Button, Modal } from "semantic-ui-react";

function FinalUpdate({ updated, setUpdated }) {
  return (
    <Modal size="mini" open={updated} onOpen={() => setUpdated(true)} onClose={() => setUpdated(false)}>
      <Modal.Header>OOPS!!</Modal.Header>
      <Modal.Content>
        <p>Something went wrong. profile could not be updated. Please try again</p>
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={() => setUpdated(false)}>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default FinalUpdate;
