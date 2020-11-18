/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Button, Form, Grid, Header, Image, Message, Segment } from "semantic-ui-react";
import { Link, useHistory } from "react-router-dom";
//import logo from "../../static/logo.png";
const index = require("../../lib/e2ee.js");
const e2e = require("../../lib/e2e-encrypt.js")
const threadDb = require("../../lib/threadDb.js")
import test from "./img/test.png";
import logo from "../../images/logoInverted.png";
import "./Form.css";

function LoginForm(props) {
  let history = useHistory();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [dbClient,setDBClient] = useState(null)
  const [identity, setIdentity] = useState(null)

  useEffect(() => {
    threadDb.init('0x25f77f929eC8bD36ea7Ef06DB98dECD12501').then((result)=>{
      setDBClient(result.client)
      setIdentity(result.identity)
      console.log("UseEffect Login all set!!")
    })
  }, []);

  async function loginUser() {
    let loginID = await threadDb.loginUser(email,password,identity,dbClient)
    if (loginID!==null) {
      let accounts = await index.getAllAccounts(password);
      console.log("LoginID:",loginID)
      const json = {
        email: email,
        _id: loginID
      }
      localStorage.setItem("USER",JSON.stringify(json))
      localStorage.setItem("password", password);
      history.push('/dashboard')
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
                <label className="form-label">Email</label>
                <input
                    className="form-input"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
              </div>

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
