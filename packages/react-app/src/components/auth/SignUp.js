import React, { useState } from "react";
import { Button, Checkbox, Form, Modal, Header } from "semantic-ui-react";

function SignUp() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Modal
        open={open}
        // onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        size="small"
      >
        <Modal.Header>Sign Up</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <div style={{ background: "red", position: "absolute" }}>
              <Form style={{ position: "relative", top: "0", left: "0" }}>
                <Form.Field>
                  <label>First Name</label>
                  <input placeholder="First Name" />
                </Form.Field>
                <Form.Field>
                  <label>Last Name</label>
                  <input placeholder="Last Name" />
                </Form.Field>
                <Form.Field>
                  <Checkbox label="I agree to the Terms and Conditions" />
                </Form.Field>
                <Button type="submit">Submit</Button>
              </Form>
            </div>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    </>
  );
}

export default SignUp;
