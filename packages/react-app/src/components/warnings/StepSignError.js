import React from "react";
import {Button, Header, Icon, Modal} from "semantic-ui-react";

function StepSignError({ signError, setSignError, setCurrent }) {
  return (
    <Modal closeIcon open={true} onClose={() => setSignError(false)} onOpen={() => setSignError(true)}>
      <Header icon="warning sign" content="OOPS" />
      <Modal.Content>
        <p>There was an error while Signing. Do you want to Sign Again?</p>
      </Modal.Content>
      <Modal.Actions>
        <Button
          color="red"
          onClick={() => {
            setSignError(false);
            setCurrent(0);
          }}
        >
          <Icon name="remove" /> No
        </Button>

        <Button color="green" onClick={() => setSignError(false)}>
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default StepSignError;
