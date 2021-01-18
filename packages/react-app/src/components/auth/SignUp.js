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
              Create an Account
            </Header>
            <FormContainer>
              <div className="Signup-form">
                <Form.Input fluid icon="user" iconPosition="left" placeholder="Enter your Full Name" type="text" />
                <Form.Input fluid icon="user" iconPosition="left" placeholder="Enter your Email  Address" />
                <Form.Input fluid icon="lock" iconPosition="left" placeholder="Password" type="password" />
                <Checkbox style={{ color: "#718096" }} className="checkbox" label="I'm a Notary" />

                <Button color="teal" fluid size="large">
                  Login
                </Button>
              </div>
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
