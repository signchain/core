import React, { useState } from "react";
import { Button, Message, Modal } from "semantic-ui-react";
import { SignInWarningContainer } from "../styles/WarningPopup.Styles";
import Warn from "../../images/icons/warn.svg";

function NetworkChange() {
  const [open, setOpen] = useState(true);
  return (
    <div>
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
                <img src={Warn} alt="" />
              </div>
              <div className="warning-text">
                <h3>Foreign Network Detected</h3>

                <p>Signchain is currently avaliable on Rinkeby Network. Please switch your active wallet Network.</p>
              </div>
              <div className="warning-btn" style={{ marginTop: "8px" }}>
                <Button
                  style={{ background: "#4C51BF", color: "#fff" }}
                  className="SignIn-btn"
                  onClick={() => setOpen(false)}
                >
                  Close
                </Button>
              </div>
            </SignInWarningContainer>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    </div>
  );
}

export default NetworkChange;
