import React from "react";
import { Link } from "react-router-dom";
import { Button, Header, Icon, Modal } from "semantic-ui-react";

function SignWarning({ sign, setSign }) {
  return (
    <Modal closeIcon open={true} onClose={() => setSign(false)} onOpen={() => setSign(true)}>
      <Header icon="warning sign" content="OOPS" />
      <Modal.Content>
        <p>There was an error while Signing. Do you want to Sign Again?</p>
      </Modal.Content>
      <Modal.Actions>
        <Link to="/documents">
          <Button color="red" onClick={() => setSign(false)}>
            <Icon name="remove" /> No
          </Button>
        </Link>
        <Link to="/documents">
          <Button color="green" onClick={() => setSign(false)}>
            <Icon name="checkmark" /> Yes
          </Button>
        </Link>
      </Modal.Actions>
    </Modal>
  );
}

export default SignWarning;
