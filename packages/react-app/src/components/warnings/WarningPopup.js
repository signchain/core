import React, { useState } from "react";
import { Button, Icon, Image, Modal } from "semantic-ui-react";
import { SignInWarningContainer } from "../styles/WarningPopup.Styles";
import Lock from "../../images/Lock.svg";
import { Link } from "react-router-dom";
function WarningPopup() {
  const [open, setOpen] = useState(true);
  return (
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
              <Button size="large" primary className="SignIn-btn">
                <Link style={{ color: "#fff" }} to="/signuptest">
                  Sign In
                </Link>
              </Button>
            </div>
          </SignInWarningContainer>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
}

export default WarningPopup;
