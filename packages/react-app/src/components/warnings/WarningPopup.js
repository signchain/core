import React, { useState } from "react";
import { Button, Icon, Image, Modal } from "semantic-ui-react";
import { SignInWarningContainer } from "../styles/WarningPopup.Styles";
import Lock from "../../images/Lock.svg";
import { Link } from "react-router-dom";
import SignUp from "../auth/SignUp"


function WarningPopup({userStatus, connectUser, authStatus, setUserStatus, identity, address, idx, seed, connectLoading}) {
  const [open, setOpen] = useState(true);

  return (
    <>
    {
      userStatus === authStatus.connected ? 
      (
        <SignUp
          userStatus={userStatus}
          authStatus={authStatus}
          setUserStatus={setUserStatus}
          identity={identity}
          address={address}
          idx={idx}
          seed={seed}
        />
      ) : 
      (
        <Modal
      open={open}
      onClose={() => setOpen(true)}
      onOpen={() => setOpen(true)}
      size="small"
      style={{ width: "512px" }}
    >
          <Modal.Content>
            <Modal.Description>
              <SignInWarningContainer>
                <div className="lock-image">
                  <img src={Lock} alt="" />
                </div>
                <div className="warning-text">
                  <h3>Sign in to use Signchain Application</h3>

                  <p>
                    In order for you to use certain features of the Signchain like Signing and Verifing Documents, please
                    sign in using your secure wallet.
                  </p>
                  <p>If you don't wish to sign in but want to explore, feel free to Browse around.</p>
                </div>
                <div className="warning-btn">
                  <Button loading={connectLoading} size="large" primary className="SignIn-btn" onClick={() => connectUser()}>
                      Sign In
                  </Button>
                </div>
              </SignInWarningContainer>
            </Modal.Description>
          </Modal.Content>
        </Modal>
      )
    }
    </>
  );
}

export default WarningPopup;
