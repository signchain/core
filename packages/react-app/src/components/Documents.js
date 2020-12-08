/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Button, Icon, Loader, Table, Modal, Step } from "semantic-ui-react";
import { Badge } from "antd";
import {authorizeUser, getAllUsers, getAllFile, downloadFiles, attachSignature} from "../lib/threadDb";

const index = require("../lib/e2ee");

import { Collapse } from "antd";
const userType = { party: 0, notary: 1 };

const { Panel } = Collapse;


export default function Documents(props) {
  const password = localStorage.getItem("password");
  const loggedUser = localStorage.getItem("USER");
  const userInfo = JSON.parse(loggedUser)

  const [open, setOpen] = useState(false);
  const [caller, setCaller] = useState({});
  const [signer, setSigner] = useState({});
  const [docs, setDocs] = useState([]);
  const [docInfo, setDocInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(null);
  const [dbClient,setDBClient] = useState(null)
  const [identity, setIdentity] = useState(null)


  useEffect(() => {
    if (props.writeContracts) {

      authorizeUser(password).then((client)=>{
        setDBClient(client)
        props.writeContracts.Signchain.on("DocumentSigned", (author, oldValue, newValue, event) => {
          getAllDoc(client);
        });
        props.writeContracts.Signchain.on("DocumentNatarized", (author, oldValue, newValue, event) => {
          getAllDoc(client);
        });
        getAllDoc(client);
        setSigner(props.userProvider.getSigner());
        getAllUsers(client, userInfo.publicKey).then(result => {
          setCaller(result.caller);
        });
      })
    }
  }, [props.writeContracts]);


  const getAllDoc = async (client) => {
    setLoading(true);
    const userInfo = JSON.parse(loggedUser)
    const doc = await getAllFile(client,userInfo.publicKey, props.address)
    if (doc.length > 0) {
      setDocs(doc);
    }
    setLoading(false);
  };

  const downloadFile = (name, key, location) => {
    setDownloading(name);
    console.log("docment:",location)
    downloadFiles(name, key, userInfo.address, location, password)
        .then(result => {setDownloading(null)});
  };

  const signDocument = async (docHash, docId) => {
    const result = await attachSignature(docId, props.userProvider.getSigner(), caller, docHash, dbClient);
  };

  const notarizeDocument = async docHash => {
    const result = await index.notarizeDoc(docHash, props.tx, props.writeContracts,
        props.userProvider.getSigner());
  };

  return (
    <div className="main__container">
      <Table singleLine striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="5">Your documents</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Registration Date</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Sign</Table.HeaderCell>
            <Table.HeaderCell>Actions </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {!loading ? (
            docs.map(value => {
              return (
                <Table.Row>
                  <Table.Cell
                    collapsing
                    onClick={() => {
                      setOpen(true);
                      setDocInfo(value);
                    }}
                  >
                    <span style={{ color: " #0000EE", cursor: "pointer" }}>
                      <Icon name="file outline" /> {value.title}
                    </span>
                  </Table.Cell>

                  <Table.Cell>{value.timestamp}</Table.Cell>

                  <Table.Cell>
                    {" "}
                    {value.signStatus ? (
                      <div>
                        <Icon name="circle" color="green" />
                        Signed
                      </div>
                    ) : (
                      <div>
                        <Icon name="circle" color="red" /> Pending
                      </div>
                    )}
                  </Table.Cell>

                  <Table.Cell>
                    {value.notary === caller.address && !value.notarySigned ? (
                      <Button basic color="blue" icon labelPosition="left" onClick={() => notarizeDocument(value.hash)}>
                        <Icon name="signup" />
                        Notarize
                      </Button>
                    ) : !value.partySigned ? (
                      <Button basic color="blue" icon labelPosition="left" onClick={() => signDocument(value.hash,
                        value.docId)}>
                        <Icon name="signup" />
                        Sign Document
                      </Button>
                    ) : (
                      <Button disabled basic color="blue" icon labelPosition="left">
                        <Icon name="signup" />
                        Sign Document
                      </Button>
                    )}
                  </Table.Cell>
                  <Table.Cell collapsing textAlign="right">
                    <Button loading={downloading === value.hash} icon="download" onClick={() => downloadFile(value.title,
                        value.key, value.documentLocation)} />
                  </Table.Cell>
                </Table.Row>
              );
            })
          ) : (
            <Loader active size="medium">
              Loading
            </Loader>
          )}
        </Table.Body>
      </Table>

      {/* demo -replace - with actual table data */}

      <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open}>
        <Modal.Header>Document Details</Modal.Header>
        <Modal.Content>
          <Table padded="very">
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  <h3>Document Name</h3>
                </Table.Cell>
                <Table.Cell>
                  <h3>{docInfo.title}</h3>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <h3>Document Hash</h3>
                </Table.Cell>
                <Table.Cell>{docInfo.hash}</Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.Cell>
                  <h3>Signature TimeStamp</h3>
                </Table.Cell>
                <Table.Cell>
                  <Step.Group vertical fluid>
                    {docInfo.signatures
                      ? docInfo.signatures.map(signature => {
                          return (
                            <Step>
                              <Icon name="time" />
                              <Step.Content>
                                <p style={{ marginLeft: "14px" }}>
                                  {signature.signer}
                                  <br />
                                  <span style={{ fontWeight: "bold" }}>Signed On </span> :
                                  {new Date(parseInt(signature.timestamp) * 1000).toDateString()}
                                </p>
                              </Step.Content>
                            </Step>
                          );
                        })
                      : null}
                  </Step.Group>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  {docInfo.notarySigned ? (
                    <Badge style={{ backgroundColor: "green" }} count="Notarized" />
                  ) : (
                    <Badge style={{ backgroundColor: "red" }} count=" Not yet Signed" />
                  )}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={() => setOpen(false)}>
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}
