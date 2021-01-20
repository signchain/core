import React, { useState, useEffect } from "react";
import { Button, Checkbox, Form, Modal, Header, Grid, Segment, Message, Input } from "semantic-ui-react";
import { Link, useHistory } from "react-router-dom";
import logo from "../../images/logoInverted.png";
import { definitions } from "../../ceramic/config.json";
import { FormContainer } from "../styles/SignUp.Styles";

import { loginUserWithChallenge, registerNewUser } from "../../lib/threadDb";
const index = require("../../lib/e2ee.js");

function SignUp({ userStatus, authStatus, setUserStatus, identity, address, idx, seed }) {
  const [open, setOpen] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notary, setNotary] = useState(false);

  const SignupStatus = { preInit: 0, init: 1, wallet: 2, ceramic: 3, contract: 4 };
  const [signupStatus, setSignupStatus] = useState(SignupStatus.preInit);
  const userType = { party: 0, notary: 1 };
  let history = useHistory();

  useEffect(() => {
    async function getUserData() {
      setSignupStatus(SignupStatus.init);
      try {
        if (idx) {
          console.log("IDDD");
          setSignupStatus(SignupStatus.init);
        }
      } catch (err) {
        console.log(err);
      }
    }
    getUserData();
  }, []);

  const registerUser = async () => {
    setSignupStatus(SignupStatus.wallet);
    const pass = Buffer.from(new Uint8Array(seed)).toString("hex");
    const walletStatus = await index.createWallet(pass);

    if (walletStatus) {
      const accounts = await index.getAllAccounts(pass);
      setSignupStatus(SignupStatus.ceramic);
      await idx.set(definitions.profile, {
        name: name,
        email: email,
        notary: notary,
      });
      setSignupStatus(SignupStatus.contract);
      //const dbClient = await authorizeUser(password)
      const client = await loginUserWithChallenge(identity);
      if (client !== null) {
        const registrationStatus = await registerNewUser(
          idx.id,
          name,
          email,
          accounts[0],
          notary ? userType.notary : userType.party,
          address,
          password,
        );
        if (registrationStatus) {
          setUserStatus(authStatus.loggedIn);
        } else {
          console.log("Some error occurred!!!");
        }
      }
    }
  };

  // if (name === "" && email === "" && password == "") {

  // }
  return (
    <>
      <Modal
        open={open}
        // onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        size="small"
        style={{ width: "450px" }}
      >
        <Modal.Header>Sign Up</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <FormContainer>
              <div className="logo-container">
                <img src={logo} alt="" srcset="" />
              </div>
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

                <Form.Field className="form-input" required>
                  <Input
                    fluid
                    icon="mail"
                    iconPosition="left"
                    placeholder="Enter your Email  Address"
                    className="form-input"
                    onChange={e => setEmail(e.target.value)}
                  />
                </Form.Field>
                <Form.Field className="form-input" required>
                  <Input
                    fluid
                    icon="lock"
                    iconPosition="left"
                    placeholder="Password"
                    type="password"
                    className="form-input"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </Form.Field>

                <Checkbox
                  style={{ color: "#718096" }}
                  className="checkbox"
                  label="I'm a Notary"
                  className="form-input"
                  checked={notary}
                  onChange={() => {
                    setNotary(!notary);
                  }}
                />

                {signupStatus == SignupStatus.init ? (
                  <Button type="primary" className="form-input-btn" disabled={!email || !name} onClick={registerUser}>
                    Sign Up
                  </Button>
                ) : signupStatus == SignupStatus.wallet ? (
                  <Button type="primary" loading className="form-input-btn" onClick={registerUser}>
                    Creating wallet
                  </Button>
                ) : signupStatus == SignupStatus.ceramic ? (
                  <Button type="primary" loading className="form-input-btn" onClick={registerUser}>
                    Creating IDX account
                  </Button>
                ) : signupStatus == SignupStatus.contract ? (
                  <Button type="primary" loading className="form-input-btn" onClick={registerUser}>
                    Creating profile
                  </Button>
                ) : (
                  <Button type="primary" loading className="form-input-btn" onClick={registerUser}>
                    Initiating ...
                  </Button>
                )}
              </Form>
            </FormContainer>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    </>
  );
}

export default SignUp;
