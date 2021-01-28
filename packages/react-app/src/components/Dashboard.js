import React from "react";
import {Label, Segment} from "semantic-ui-react";
import "./Dashboard.css";
import Secure from "../images/icons/secureDocs.svg";
import Sign from "../images/icons/signDocs.svg";
import Verify from "../images/icons/VerifyDocs.svg";
import {Link} from "react-router-dom";
import {DashboardContainer} from "./styles/Dashboard.Styles";

const Dashboard = props => {
  return (
    <>
      <DashboardContainer>
        <h1 className="welcome-heading">Welcome to Signchain</h1>

        <div className="select-actions">
          <Link to="/sign">
            <Segment className="box-1">
              <div className="icon">
                <img src={Sign} alt="" srcset="" />
              </div>
              <p>Sign & Share</p>
            </Segment>
          </Link>
          <Link to="/verify">
            <Segment className="box-1">
              <div className="icon">
                <img src={Verify} alt="" srcset="" />
              </div>
              <p>Verify</p>
            </Segment>
          </Link>
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
};

export default Dashboard;
