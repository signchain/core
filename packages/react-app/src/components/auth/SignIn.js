import React, {useState} from "react";
import {Button, Form, Message, Modal} from "semantic-ui-react";
import {useHistory} from "react-router-dom";
import logo from "../../images/logoInverted.png";
import {FormContainer} from "../styles/SignUp.Styles";

function SignUp() {
  const [open, setOpen] = useState(true);

  const [password, setPassword] = useState("");

  const SignupStatus = { preInit: 0, init: 1, wallet: 2, ceramic: 3, contract: 4 };
  const [signupStatus, setSignupStatus] = useState(SignupStatus.preInit);
  const userType = { party: 0, notary: 1 };
  let history = useHistory();
  return (
    <>
      <Modal
        open={open}
        // onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        size="small"
        style={{ width: "450px" }}
      >
        <Modal.Header>Log In</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <FormContainer>
              <div className="logo-container">
                <img src={logo} alt="" srcset="" />
              </div>

              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                className="form-input"
              />

              <Button fluid size="large" className="btn-primary">
                Login
              </Button>
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
