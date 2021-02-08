import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Message, Modal } from "semantic-ui-react";
import logo from "../../images/logoInverted.png";
import { definitions } from "../../ceramic/config.json";
import { FormContainer } from "../styles/SignUp.Styles";
import { loginUserWithChallenge, registerNewUser } from "../../lib/threadDb";

const index = require("../../lib/e2ee.js");
const moment = require("moment");

function SignUp({ authStatus, setUserStatus, identity, address, idx, seed }) {
  const [open, setOpen] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("NA");
  const [notary, setNotary] = useState(false);
  const [error, setError] = useState({ status: false, message: "" });

  const SignupStatus = { preInit: 0, init: 1, wallet: 2, ceramic: 3, contract: 4 };
  const [signupStatus, setSignupStatus] = useState(SignupStatus.preInit);
  const userType = { party: 0, notary: 1 };

  useEffect(() => {
    async function getUserData() {
      setSignupStatus(SignupStatus.init);
      try {
        if (idx) {
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
      try {
        await idx.set(definitions.profile, {
          name: name,
          email: email,
          notary: notary,
          joindate: moment(new Date()).format("ll"),
          userAddress: address,
          phoneNumber: 'NA',
          dob: 'NA'
        });
      } catch (e) {
        console.log("Failed to create profile on IDX");
      }
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
        );
        if (registrationStatus) {
          setUserStatus(authStatus.loggedIn);
        } else {
          localStorage.clear();
          setError({ status: true, message: "An account with same email/ wallet address exists" });
          setSignupStatus(SignupStatus.init);
        }
      }
    }
  };

  return (
    <>
      <Modal
        open={open}
        // onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        size="small"
        style={{ width: "450px" }}
      >
        <Modal.Header>Please provide these details</Modal.Header>
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

                <Form.Field className="form-input">
                  <Input
                    fluid
                    icon="mail"
                    iconPosition="left"
                    pattern=".+@globex.com"
                    placeholder="JohnDoe@domain.com"
                    className="form-input"
                    onChange={e => setEmail(e.target.value)}
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
                {error.status ? (
                  <Message negative>
                    <Message.Header>Account creation failed</Message.Header>
                    <p> {error.message}</p>
                  </Message>
                ) : null}

                {signupStatus == SignupStatus.init ? (
                  <Button type="primary" className="form-input-btn" disabled={!name} onClick={registerUser}>
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
