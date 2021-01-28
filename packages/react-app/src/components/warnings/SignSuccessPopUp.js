import React from "react";
import {Button, Modal} from "semantic-ui-react";

import {SignInWarningContainer} from "../styles/WarningPopup.Styles";
import Success from "../../images/icons/success.svg";
import {Link} from "react-router-dom";

function SignSuccessPopUp({ setOpen, open, setSignedStatus }) {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      size="small"
      style={{ width: "512px" }}
    >
      <Modal.Content>
        <Modal.Description>
          <SignInWarningContainer>
            <div className="lock-image">
              <img src={Success} alt="" />
            </div>
            <div className="warning-text" style={{ marginTop: "8px" }}>
              <h3>Document Signed/Notarized Successfully!!</h3>
            </div>
            <div style={{ marginTop: "18px" }} className="warning-btn">
              <Link to="/documents">
                <Button
                  style={{ backgroundColor: "#4C51BF", color: "#fff" }}
                  className="SignIn-btn"
                  onClick={() => {
                    setOpen(false);
                    setSignedStatus(false);
                    // location.reload();
                  }}
                >
                  OK
                </Button>
              </Link>
            </div>
          </SignInWarningContainer>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
}

export default SignSuccessPopUp;
