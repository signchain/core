import React from "react";
import { Card, Grid } from "semantic-ui-react";
import "./Dashboard.css";
import Secure from "../images/icons/secureDocs.svg";
import Sign from "../images/icons/signDocs.svg";
import Verify from "../images/icons/VerifyDocs.svg";
import { Link } from "react-router-dom";
import { DashboardContainer } from "./styles/Dashboard.Styles";

const Dashboard = () => (
  <>
    <DashboardContainer>
      <h1 className="welcome-heading">Welcome to Signchain</h1>

      <div className="select-actions">
        <Link to="/sign">
          <div className="box-1">
            <div className="icon">
              <img src={Sign} alt="" srcset="" />
            </div>
            <p>Sign & Share</p>
          </div>
        </Link>
        <Link to="/sign">
          <div className="box-1">
            <div className="icon">
              <img src={Secure} alt="" srcset="" />
            </div>
            <p>Secure & Share</p>
          </div>
        </Link>
        <Link to="/verify">
          <div className="box-1">
            <div className="icon">
              <img src={Verify} alt="" srcset="" />
            </div>
            <p>Verify</p>
          </div>
        </Link>
      </div>
    </DashboardContainer>
  </>
);

export default Dashboard;
