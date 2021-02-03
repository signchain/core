import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Message, Modal } from "semantic-ui-react";

import { FormContainer } from "./EditProfile.Styles";

function EditProfile({ open, setOpen }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notary, setNotary] = useState(false);
  const [error, setError] = useState({ status: false, message: "" });

  const SignupStatus = { preInit: 0, init: 1, wallet: 2, ceramic: 3, contract: 4 };
  const [signupStatus, setSignupStatus] = useState(SignupStatus.preInit);
  const userType = { party: 0, notary: 1 };

  return (
    <>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        size="small"
        style={{ width: "450px" }}
      >
        <Modal.Header>Please provide these details</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <FormContainer>
              <Form>
                <Form.Field className="form-input" required>
                  <Input
                    fluid
                    icon="user"
                    iconPosition="left"
                    placeholder="Enter your Full Name"
                    type="text"
                    className="form-input"
                    onChange={e => setName(e.target.value)}
                  />
                </Form.Field>

                <Form.Field className="form-input">
                  <Input
                    fluid
                    icon="mail"
                    iconPosition="left"
                    placeholder="JohnDoe@domain.com"
                    className="form-input"
                    onChange={e => setEmail(e.target.value)}
                  />
                </Form.Field>

                <Button type="primary" className="form-input-btn" disabled={!name}>
                  Sign Up
                </Button>
              </Form>
            </FormContainer>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    </>
  );
}

export default EditProfile;
