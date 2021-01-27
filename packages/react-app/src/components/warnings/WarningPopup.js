import React, { useState } from "react";
import { Button, Icon, Message, Modal } from "semantic-ui-react";
import { SignInWarningContainer } from "../styles/WarningPopup.Styles";
import Lock from "../../images/Lock.svg";
import { Link } from "react-router-dom";
import SignUp from "../auth/SignUp";

function WarningPopup({
  userStatus,
  connectUser,
  authStatus,
  setUserStatus,
  identity,
  address,
  idx,
  seed,
  connectLoading,
}) {
  const [open, setOpen] = useState(true);

  return (
    <>
      {userStatus === authStatus.connected ? (
        <SignUp
          userStatus={userStatus}
          authStatus={authStatus}
          setUserStatus={setUserStatus}
          identity={identity}
          address={address}
          idx={idx}
          seed={seed}
        />
      ) : (
        <Modal
          open={open}
          onClose={() => setOpen(true)}
          onOpen={() => setOpen(true)}
          size="small"
          style={{ width: "512px" }}
        >
          <Modal.Content>
            <Modal.Description>
              { userStatus === authStatus.disconnected ?
              <SignInWarningContainer>
                <div className="lock-image">
                  <img src={Lock} alt="" />
                </div>
                <div className="warning-text">
                  <h3>Sign in to use Signchain Application</h3>

                  <p>
                    In order to use certain features of the Signchain like Signing and Verifying Documents,
                    please sign in using your secure wallet.
                  </p>
                  <p>Signchain currently supports only <a href="https://metamask.io/download.html">MetaMask</a>.
                  Make sure you have installed and pointed to the right account</p>
                </div>
                <div className="warning-btn">
                  <Button
                    loading={connectLoading}
                    style={{ background: "#4C51BF", color: "#fff" }}
                    className="SignIn-btn"
                    onClick={() => connectUser()}
                  >
                    Sign In
                  </Button>
                </div>
              </SignInWarningContainer> :
              <SignInWarningContainer>
                <div className="lock-image">
                  <img src={Lock} alt="" />
                </div>
                <div className="warning-text">
                  <h3>Sign in to use Signchain Application</h3>
                  <Message negative>
                <Message.Header>Login failed</Message.Header>
                 <p> Looks like your current wallet account is different from the previous session. Please try switching the wallet account and <a onClick={() => connectUser()}>connect again </a> <br/>
                 Alternatively, you can Sign Up again. Beaware that you will lose your previous account.
                 </p>
                </Message>
                 </div>
                <div className="warning-btn">
                  <Button
                    style={{ background: "#4C51BF", color: "#fff" }}
                    className="SignIn-btn"
                    onClick={() => {setUserStatus(authStatus.connected)}}
                  >
                    Sign Up
                  </Button>
                </div>
              </SignInWarningContainer>
            }
            </Modal.Description>
          </Modal.Content>
        </Modal>
      )}
    </>
  );
}

export default WarningPopup;
