import React, { useState } from "react";
import { Button, Checkbox, Form, Modal, Header, Grid, Segment, Message } from "semantic-ui-react";
import { FormContainer } from "../styles/SignUp.Styles";

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
            <Header as="h2" color="teal" textAlign="center">
              {/* <Image src="/logo.png" /> */}
              Log-in to your account
            </Header>
            <FormContainer>
              <Form size="huge">
                <div className="Signup-form">
                  <Form.Input fluid icon="user" iconPosition="left" placeholder="E-mail address" />
                  <Form.Input fluid icon="lock" iconPosition="left" placeholder="Password" type="password" />
                  <Form.Input fluid icon="lock" iconPosition="left" placeholder="Password" type="password" />
                  <Form.Input fluid icon="lock" iconPosition="left" placeholder="Password" type="password" />
                  <Form.Input fluid icon="lock" iconPosition="left" placeholder="Password" type="password" />
                  <Form.Input fluid icon="lock" iconPosition="left" placeholder="Password" type="password" />

                  <Button color="teal" fluid size="large">
                    Login
                  </Button>
                </div>
              </Form>
            </FormContainer>
            <Message>
              New to us? <a href="#">Sign Up</a>
            </Message>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    </>
  );
}

export default SignUp;
