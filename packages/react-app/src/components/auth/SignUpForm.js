/* eslint-disable */
import React, { useEffect, useState } from "react";
import "./Form.css";
import { Checkbox } from "semantic-ui-react";
import { Button } from "antd";
import { Link, useHistory } from "react-router-dom";
import logo from "../../images/logoInverted.png";

const index = require("../../lib/e2ee.js");
const threadDb = require('../../lib/threadDb.js')
import { profileSchema } from "../../ceramic/schemas";
import { createDefinition } from "@ceramicstudio/idx-tools";

import test from "./img/test.png";

function SignUpForm({ address,writeContracts, tx, ceramic, idx }) {
  let history = useHistory();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notary, setNotary] = useState(false);
  const [dbClient,setDBClient] = useState(null);
  const [identity, setIdentity] = useState(null);


  const SignupStatus = { preInit: 0, init: 1, wallet: 2, ceramic: 3, contract: 4 };
  const [signupStatus, setSignupStatus] = useState(SignupStatus.preInit);
  const userType = { party: 0, notary: 1 };
  

  useEffect(() => {
    async function getUserData() {
        try{
         if(idx) {
           console.log("IDDD")
           setSignupStatus(SignupStatus.init);
         }
        }catch(err){
            console.log(err);
        }
    }
     getUserData()
 }, [idx] )

  useEffect(()=>{
    threadDb.init("0x25f77f929eC8bD36ea7Ef06DB98dECD12501").then((result)=>{
      setDBClient(result.client)
      setIdentity(result.identity)
      console.log("USER ADDRESS:",address)
      console.log("UseEffect all set!!")
      setSignupStatus(SignupStatus.init);
    })
  },[])

  const registerUser = async () => {
    setSignupStatus(SignupStatus.wallet);
    const walletStatus = await index.createWallet(password);

    if (walletStatus) {
      const accounts = await index.getAllAccounts(password);
      // setSignupStatus(SignupStatus.ceramic);
      // const profileId = await createDefinition(ceramic, {
      //   name: "Signchain Profile",
      //   schema: profileSchema,
      // });
      //
      // await idx.set(profileId, {
      //   name: name,
      //   email: email,
      //   notary: notary,
      // });
      //
      // localStorage.setItem("profileSchema", profileId);
      // setSignupStatus(SignupStatus.contract);
      console.log("CLIENT:",dbClient)
      const registrationStatus = await threadDb.registerUser(
        name,
        email,
        password,
        accounts[0],
        notary ? userType.notary : userType.party,
        address,
        identity,
        dbClient
      );
      if (registrationStatus) {
        history.push({
          pathname: "/login",
        });
      }
    }
  };

  return (
    <>
  
        <div className="form-container">
          <div className="form-content-left">
            <div className="logo_inverted">
              <img src={logo} alt="" srcset="" />
            </div>
            <div className="form">
              <h2>Create an Account</h2>
              <div className="form-inputs">
                <label className="form-label">Full name</label>
                <input
                  className="form-input"
                  type="text"
                  name="username"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
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

              <div className="form-inputs">
                <Checkbox
                  style={{ color: "#718096" }}
                  className="checkbox"
                  label="I'm a Notary"
                  checked={notary}
                  onChange={() => {
                    setNotary(!notary);
                  }}
                />
              </div>

              {signupStatus == SignupStatus.init ? (
                <Button type="primary" className="form-input-btn" onClick={registerUser}>
                  Sign Up
                </Button>
              ) : signupStatus == SignupStatus.wallet ? (
                <Button type="primary" loading className="form-input-btn" onClick={registerUser}>
                  Creating wallet
                </Button>
              ) : signupStatus == SignupStatus.ceramic ? (
                <Button type="primary" loading className="form-input-btn" onClick={registerUser}>
                  Creating IDX account
                </Button>
              ) : signupStatus == SignupStatus.contract ? (
                <Button type="primary" loading className="form-input-btn" onClick={registerUser}>
                  Creating profile
                </Button>
              ) : 
              <Button type="primary" loading className="form-input-btn" onClick={registerUser}>
               Initiating ...
              </Button>
              }
              <span className="form-input-login">
                Already have an account? Login <Link to="/login">here</Link>
              </span>
            </div>
          </div>
          <div className="form-content-right">
            <img src={test} className="form-img" alt="left" srcset="" />
          </div>
        </div>
  
    </>
  );
}
export default SignUpForm;
