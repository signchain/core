import React, { useState, useEffect } from "react";
import { Label, Segment, Button, Modal, Icon } from "semantic-ui-react";
import { Link, Redirect } from "react-router-dom";
// import { Steps } from "intro.js-react";
import Secure from "../../images/icons/secureDocs.svg";

import Sign from "../../images/icons/signDocs.svg";
import Verify from "../../images/icons/VerifyDocs.svg";

import { DashboardContainer } from "./Onboarding.Styles";

const Onboarding = () => {
  const [firstOpen, setFirstOpen] = useState(true);
  const [secondOpen, setSecondOpen] = useState(false);
  const [thirdOpen, setThirdOpen] = useState(false);
  const [visited, setVisted] = useState(localStorage.getItem("Visited"));

  useEffect(() => {
    localStorage.setItem("Visited", true);
  }, []);
  if (visited) {
    return <Redirect to="/home"></Redirect>;
  } else {
    return (
      <>
        <Modal
          onClose={() => setFirstOpen(false)}
          onOpen={() => setFirstOpen(true)}
          open={firstOpen}
          dimmer={false}
          size="small"
          style={{ width: "550px", height: "339px" }}
        >
          <Modal.Header>Sign & Share</Modal.Header>
          <Modal.Content centered>
            <DashboardContainer>
              <div className="box-1">
                <div className="icon">
                  <img src={Sign} alt="" srcset="" />
                </div>
                <p>Sign & Share</p>
              </div>

              <p className="helper-text">
                The easiest way to send, receive and manage legally binding electronic signatures.
              </p>
            </DashboardContainer>
          </Modal.Content>
          <Modal.Actions>
            <Button
              onClick={() => {
                setSecondOpen(true);
              }}
              style={{ background: "rgb(76, 81, 191)", color: "#fff" }}
            >
              Next <Icon name="angle right" />
            </Button>
          </Modal.Actions>

          {/* second Modal */}

          <Modal
            onClose={() => setSecondOpen(false)}
            open={secondOpen}
            size="small"
            dimmer={false}
            style={{ width: "550px", height: "339px" }}
          >
            <Modal.Header>Verify</Modal.Header>
            <Modal.Content>
              <DashboardContainer>
                <div className="box-1">
                  <div className="icon">
                    <img src={Verify} alt="" srcset="" />
                  </div>
                  <p>Verify Document</p>
                </div>
                <p className="helper-text">
                  Signchain uses standard dicentralized digital identity and signature proofs that can be verified on
                  any platform.
                </p>
              </DashboardContainer>
            </Modal.Content>
            <Modal.Actions>
              <Button
                icon="angle left"
                content="Previous"
                onClick={() => {
                  setFirstOpen(true);
                  setSecondOpen(false);
                }}
              />
              <Button
                onClick={() => setThirdOpen(true)}
                className="btn-primary"
                style={{ background: "rgb(76, 81, 191)", color: "#fff" }}
              >
                Next
                <Icon name="angle right" />
              </Button>
            </Modal.Actions>
          </Modal>

          {/* Third Modal */}

          <Modal
            onClose={() => setThirdOpen(false)}
            open={thirdOpen}
            size="small"
            dimmer={false}
            style={{ width: "550px", height: "339px" }}
          >
            <Modal.Header>Secure & Share (Coming Soon)</Modal.Header>
            <Modal.Content>
              <DashboardContainer>
                <div className="box-1">
                  <div className="icon">
                    <img src={Secure} alt="" srcset="" />
                  </div>
                  <p>Secure & Share</p>
                </div>
                <p className="helper-text">
                  We focus on delivering the much needed privacy for the legal documents through contracts, DIDs and E2E
                  encryption.
                </p>
              </DashboardContainer>
            </Modal.Content>
            <Modal.Actions>
              <Button
                icon="angle left"
                content="Previous"
                onClick={() => {
                  setSecondOpen(true);
                  setThirdOpen(false);
                }}
              />
              <Link to="/home">
                <Button
                  onClick={() => {
                    setThirdOpen(true);
                  }}
                  className="btn-primary"
                  style={{ background: "rgb(76, 81, 191)", color: "#fff" }}
                >
                  Goto App
                  <Icon name="angle right" />
                </Button>
              </Link>
            </Modal.Actions>
          </Modal>
        </Modal>

        {/* ************************** */}
        <DashboardContainer>
          <h1 className="welcome-heading">Welcome to Signchain</h1>

          <div className="select-actions">
            <div className="box-1" onClick={() => setFirstOpen(true)}>
              <div className="icon">
                <img src={Sign} alt="" srcset="" />
              </div>
              <p>Sign & Share</p>
            </div>

            <div className="box-1">
              <div className="icon">
                <img src={Verify} alt="" srcset="" />
              </div>
              <p>Verify</p>
            </div>

            <Segment className="box-2">
              <Label attached="bottom left" color="violet">
                Coming soon
              </Label>
              <div className="icon">
                <img src={Secure} alt="" srcset="" />
              </div>
              <p>Secure & Share</p>
            </Segment>
          </div>
        </DashboardContainer>
      </>
    );
  }
};

export default Onboarding;
