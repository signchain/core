import React from "react";
import { Button, Icon, Modal } from "semantic-ui-react";

function updateSuccess({ success, setSuccess }) {
  return (
    <Modal size="mini" open={success} onOpen={() => setSuccess(true)} onClose={() => setSuccess(false)}>
      <Modal.Header>Success</Modal.Header>
      <Modal.Content>
        <p>Your Profile has been Updated.</p>
      </Modal.Content>
      <Modal.Actions>
        <Button positive onClick={() => setSuccess(false)}>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default updateSuccess;
