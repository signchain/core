import React from "react";
import { Button, Icon, Modal } from "semantic-ui-react";

function updateSuccess({ success, setSuccess }) {
  return (
    <Modal size="mini" onOpen={() => setSuccess(true)} onClick={() => setSuccess(false)}>
      <Modal.Header>OOPS!!</Modal.Header>
      <Modal.Content>
        <p>Invalid Email/Phone format.</p>
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={() => setSuccess(false)}>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default updateSuccess;
