import React from "react";
import "./SignInWarning.css";
import { Button } from "antd";
import Lock from "../../images/Lock.svg";

function SignInWarning() {
  return (
    <div className="SignInWarningContainer">
      <div className="lock-image">
        <img src={Lock} alt="" />
      </div>
      <div className="warning-text">
        <h3>Sign in to use Signchain Application</h3>

        <p>
          In order for you to use certain features of the Signchain like Signing and Verifying Documents, please sign in
          using your secure wallet.
        </p>
        <p>If you don't wish to sign in but want to explore, feel free to Browse around.</p>
      </div>
      <div className="warning-btn">
        <Button size="large" primary className="SignIn-btn">
          Sign In
        </Button>
      </div>
    </div>
  );
}

export default SignInWarning;
