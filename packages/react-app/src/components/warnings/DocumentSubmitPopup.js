import React, {useState} from "react";
import {Button, Modal} from "semantic-ui-react";

import {SignInWarningContainer} from "../styles/WarningPopup.Styles";
import Success from "../../images/icons/success.svg";
import {Link} from "react-router-dom";

function DocumentSubmitPopup({ setCurrent, setSubmitStatus }) {
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
                <img src={Success} alt="" />
              </div>
              <div className="warning-text" style={{ marginTop: "8px" }}>
                <h3>Document Shared Successfully!!</h3>

                <p>
                  In order to view shared documents click on VIEW button or click on SHARE MORE to share more documents.
                </p>
              </div>
              <div style={{ marginTop: "18px" }} className="warning-btn">
                <Link to="/documents">
                  <Button style={{ backgroundColor: "#4C51BF", color: "#fff" }} className="SignIn-btn">
                    VIEW
                  </Button>
                </Link>
                <Button
                  style={{ marginLeft: "10px", backgroundColor: "#4C51BF", color: "#fff" }}
                  primary
                  className="SignIn-btn"
                  onClick={() => {
                    setCurrent(0);
                    setSubmitStatus(false);
                  }}
                >
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
