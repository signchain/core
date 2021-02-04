import React from "react";
import { Button, Icon, Modal } from "semantic-ui-react";

function Warning({ warning, setWarning }) {
  return (
    <Modal size="mini" onOpen={() => setWarning(true)} onClick={() => setWarning(false)}>
      <Modal.Header>OOPS!!</Modal.Header>
      <Modal.Content>
        <p>Invalid Email/Phone format.</p>
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={() => setWarning(false)}>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default Warning;
