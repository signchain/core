/* eslint-disable */

import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import "./stepper.css";
import { Steps, message } from "antd";
import { Grid, Image, Button } from "semantic-ui-react";
import SelectFiles from "./SelectFiles";
import SelectParties from "./SelectParties";
import Preview from "./Preview";
import { getAllUsers, registerDoc } from "../../lib/threadDb";
import { sendMail } from "../../lib/notifications";
import DocumentSubmitPopup from "../warnings/DocumentSubmitPopup";

const { Step } = Steps;

const steps = [
  {
    title: "Select Document",
    content: args => {
      return (
        <SelectFiles
          setFileInfo={args.setFileInfo}
          setSubmitting={args.setSubmitting}
          setTitle={args.setTitle}
          submitting={args.submitting}
        />
      );
    },
  },
  {
    title: "Select Parties",
    content: args => {
      return (
        <SelectParties
          users={args.users}
          parties={args.parties}
          notaries={args.notaries}
          setParties={args.setParties}
          setCC={args.setCC}
          setDocNotary={args.setDocNotary}
        />
      );
    },
  },
  {
    title: "Preview and Sign",
    content: args => {
      return <Preview parties={args.parties} fileInfo={args.fileInfo} title={args.title} cc={args.cc} />;
    },
  },
];

const stepper = props => {
  const password = localStorage.getItem("password");
  const loggedUser = localStorage.getItem("USER");

  const [signer, setSigner] = useState({});
  const [users, setUsers] = useState([]);
  const [notaries, setNotaries] = useState([]);
  const [docNotary, setDocNotary] = useState(null);
  const [caller, setCaller] = useState(null);
  const [parties, setParties] = useState([]);
  const [cc, setCC] = useState("");
  const [file, selectFile] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [fileInfo, setFileInfo] = useState({});
  const [title, setTitle] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(false)

  let fileInputRef = React.createRef();

  useEffect(() => {
    if (props.writeContracts) {
      props.writeContracts.Signchain.on("DocumentSigned", (author, oldValue, newValue, event) => {});
      setSigner(props.userProvider.getSigner());
      const userInfo = JSON.parse(loggedUser);
      getAllUsers(userInfo.publicKey).then(result => {
        setUsers(result.userArray);
        setCaller(result.caller);
        setNotaries(result.notaryArray);
      });
    }
  }, [props.writeContracts]);

  const [current, setCurrent] = useState(0);
  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const submitDocument = async () => {
    try{
    const { docId, signatureID } = await registerDoc(
      parties.concat([caller]),
      fileInfo,
      title,
      setSubmitting,
      signer,
      docNotary,
      caller,
      props.tx,
      props.writeContracts,
    );
    if(docId !== null && signatureID !== null){
    const urlParams = `${docId[0]}/${signatureID[0]}`;
    await sendMail(
      parties
        .map(party => {
          return party.email;
        })
        .concat([cc]),
      { sender: caller.name, docId: urlParams },
    );
    setSubmitStatus(true)
    }else{
      alert("Didnt submit mail")
      setSubmitStatus(false)
    }
    }
    catch(e){
      console.log(e)
      setSubmitStatus(false)
    }
  };

  return (
    <>
      {
        submitStatus ?
          <DocumentSubmitPopup setCurrent={setCurrent} setSubmitStatus={setSubmitStatus}/>
          :
          <div className="step__container">
            <Grid columns="two">
              <Grid.Row>
                <Grid.Column width={12}>
                  <div className="steps-content">
                    {steps[current].content({
                      users,
                      notaries,
                      submitting,
                      setTitle,
                      setParties,
                      setCC,
                      setFileInfo,
                      parties,
                      fileInfo,
                      title,
                      cc,
                      setSubmitting,
                      setDocNotary,
                    })}
                  </div>

                  <div className="steps-action" style={{ float: "right" }}>
                    {current > 0 && (
                      <Button style={{ margin: "0 8px" }} onClick={() => prev()} className="button">
                        Previous
                      </Button>
                    )}

                    {current < steps.length - 1 && (
                      <Button
                        type="primary"
                        loading={submitting}
                        onClick={() => next()}
                        className="next-btn"
                        style={{ background: "#4C51BF", color: "#fff" }}
                      >
                        Next
                      </Button>
                    )}

                    {current === steps.length - 1 && (
                      <Button
                        type="primary"
                        style={{ background: "#4C51BF", color: "#fff" }}
                        loading={submitting}
                        onClick={() => submitDocument()}
                        className="next-btn"
                      >
                        Sign & Share
                      </Button>
                    )}
                  </div>
                </Grid.Column>

                <Grid.Column width={4}>
                  <div className="stepper__container">
                    <Steps direction="vertical" current={current}>
                      {steps.map(item => (
                        <Step
                          key={item.title}
                          title={item.title}
                          style={{ display: "flex", border: "1px solid  #cbd5e0", alignItems: "center", padding: "10px" }}
                        />
                      ))}
                    </Steps>
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
      }
    </>
  );
};

export default stepper;
