import React from "react";
import {Button, Header, Modal} from "semantic-ui-react";

function SignWarning({ signWarning, setSignWarning }) {
  return (
    <Modal closeIcon open={true} onClose={() => setSignWarning(false)} onOpen={() => setSignWarning(true)}>
      <Header icon="warning sign" content="OOPS" />
      <Modal.Content>
        <p>Unexpected Error occured while Signing/Notarizing the Document. Try Again!!</p>
      </Modal.Content>
      <Modal.Actions>
        <Button
          color="green"
          onClick={() => {
            setSignWarning(false);
          }}
        >
          Ok
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default SignWarning;
