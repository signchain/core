/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
const index = require("../../lib/e2ee.js");
import {getLoginUser, authorizeUser, generateIdentity, loginUserWithChallenge} from "../../lib/threadDb";
import wallet from 'wallet-besu'
import test from "./img/test.png";
import logo from "../../images/logoInverted.png";
import "./Form.css";

function LoginForm(props) {
  let history = useHistory();
  const [password, setPassword] = useState("");

  async function loginUser() {
    const accounts = await wallet.login(password);
    if (accounts!==null) {
      //const dbClient = await authorizeUser(password)
      const identity = await generateIdentity();
      const dbClient = await loginUserWithChallenge(identity);
      console.log('DBClient:', dbClient)
      console.log("USER Login!!")
      /*if (dbClient !== null) {
        let userInfo = await getLoginUser(accounts[0], dbClient)
        if (userInfo !== null) {
          console.log("User Info:", userInfo)
          localStorage.setItem("USER", JSON.stringify(userInfo))
          localStorage.setItem("password", password);
          history.push('/dashboard')
        }
      } else {
        console.log("Some error!!!")
      }*/
    }else{
      console.log("Wrong password!!")
    }
  }

  return (
    <>
      {/*<div className="form__container">*/}
        <div className="form-container">
          <div className="form-content-left">
            <div className="logo_inverted ">
              <img src={logo} alt="" srcset="" />
            </div>
            <div className="form">
              <h2>Login to your Account</h2>

              <div className="form-inputs">
                <label className="form-label">Password</label>
                <input
                  className="form-input"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              <button className="form-input-btn" onClick={loginUser}>
                Login
              </button>
              <span className="form-input-login">
                Haven't registered ? Sign Up <Link to="/signup">here</Link>
              </span>
            </div>
          </div>
          <div className="form-content-right">
            <img src={test} className="form-img" alt="left" srcset="" />
          </div>
        </div>
      {/*</div>*/}
    </>
  );
}
export default LoginForm;
