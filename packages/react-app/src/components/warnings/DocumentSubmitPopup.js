import React, { useState } from "react";
import { Button, Icon, Image, Modal } from "semantic-ui-react";
import { SignInWarningContainer } from "../styles/WarningPopup.Styles";
import Lock from "../../images/Lock.svg";
import { Link } from "react-router-dom";

function DocumentSubmitPopup({setCurrent, setSubmitStatus}) {
  const [open, setOpen] = useState(true);

  return (
    <>
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
                <h3>Document Shared Successfully!!</h3>

                <p>
                  In order to view shared documents click on VIEW button or click on SHARE MORE to
                  share more documents.
                </p>
              </div>
              <div className="warning-btn">
                <Link to='/documents'>
                <Button size="large" primary className="SignIn-btn">
                  VIEW
                </Button>
                </Link>
                <Button size="large" style={{marginLeft:'10px'}} primary className="SignIn-btn" onClick={()=> {
                  setCurrent(0)
                  setSubmitStatus(false)
                }}>
                  SHARE MORE
                </Button>
              </div>
            </SignInWarningContainer>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    </>
  );
}

export default DocumentSubmitPopup;
