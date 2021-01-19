/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Button, Icon, Loader, Table, Modal, Step } from "semantic-ui-react";
import { Badge } from "antd";
import { getAllUsers, getAllFile, downloadFiles, attachSignature, notarizeDoc, getCredentials } from "../lib/threadDb";
import {Link} from 'react-router-dom'
import "./Documents.css";
import File from "./../images/icons/Files.svg";
import Sign from "./../images/icons/Sign.svg";
import Download from "./../images/icons/Download.svg";
import { Client } from "@textile/hub";
const index = require("../lib/e2ee");

import { Collapse } from "antd";
const userType = { party: 0, notary: 1 };

const { Panel } = Collapse;

export default function Documents(props) {

  const loggedUser = localStorage.getItem("USER");
  const userInfo = JSON.parse(loggedUser);

  const [open, setOpen] = useState(false);
  const [caller, setCaller] = useState({});
  const [signer, setSigner] = useState({});
  const [docs, setDocs] = useState([]);
  const [docInfo, setDocInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(null);
  const [dbClient, setDBClient] = useState(null);
  const [identity, setIdentity] = useState(null);

  useEffect(() => {
    if (props.writeContracts) {
      props.writeContracts.Signchain.on("DocumentSigned", (author, oldValue, newValue, event) => {
        getAllDoc();
      });
      props.writeContracts.Signchain.on("DocumentNatarized", (author, oldValue, newValue, event) => {
        getAllDoc();
      });
      getAllDoc();
      setSigner(props.userProvider.getSigner());
      getAllUsers(userInfo.publicKey).then(result => {
        setCaller(result.caller);
      });
    }
  }, [props.writeContracts]);

  const getAllDoc = async () => {
    setLoading(true);
    const userInfo = JSON.parse(loggedUser);
    const document = await getAllFile(userInfo.publicKey, props.address, props.tx, props.writeContracts);
    console.log("Docs:", document)
    if (document.length > 0) {
      setDocs(document);
    }
    setLoading(false);
  };


  return (
    <div className="main__container">
      {/*<Table singleLine striped>
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
                      <Button
                        basic
                        color="blue"
                        icon
                        labelPosition="left"
                        onClick={() => notarizeDocument(value.docId, value.hash)}
                      >
                        <Icon name="signup" />
                        Notarize
                      </Button>
                    ) : !value.partySigned ? (
                      <Button
                        basic
                        color="blue"
                        icon
                        labelPosition="left"
                        onClick={() => signDocument(value.hash, value.docId)}
                      >
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
                    <Button
                      loading={downloading === value.hash}
                      icon="download"
                      onClick={() => downloadFile(value.title, value.key, value.documentLocation)}
                    />
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
      </Table>*/}

      {/* demo -replace - with actual table data */}

      {/*<Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open}>
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
                                  <span style={{ fontWeight: "bold" }}>Signed On </span> :{signature.timestamp}
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
      </Modal>*/}

      {/* my code */}

      <h3>My Documents</h3>
      <div className="documents__container">
        {!loading ? (
          docs.map(value => {

            return (
              <>

                <Link to={`/documents/${encodeURIComponent(value.documentId)}/${encodeURIComponent(value.signatureId)}`}>
                <div className="document_card">
                  <div
                    className="meta_info"
                    onClick={() => {
                      setOpen(true);
                      setDocInfo(value);
                    }}
                  >
                    <div className="name-content">
                      <div className="left">
                        <div>
                          <img
                            className="img-container"
                            src="https://react.semantic-ui.com/images/avatar/large/patrick.png"
                            alt=""
                            srcset=""
                          />
                        </div>
                      </div>
                      <div className="right">
                        <p className="card__h1"> Shared By</p>
                        <p className="data">{value.createdBy}</p>
                      </div>
                    </div>

                    <div className="shared-date">
                      <p className="card__h1">Shared On</p>
                      <p className="data">{value.date}</p>
                    </div>
                  </div>

                  <div className="document__info">
                    <div
                      className="boxes"
                      onClick={() => {
                        setOpen(true);
                        setDocInfo(value);
                      }}
                    >
                      <div className="docs-icon">
                        <img src={File} alt="" srcset="" />
                      </div>
                      <p> {value.fileName}</p>
                    </div>
                    <div
                      className="boxes"
                      onClick={() => {
                        setOpen(true);
                        setDocInfo(value);
                      }}
                    >
                      <div className="docs-icon">
                        <img src={Sign} alt="" srcset="" />
                      </div>
                      {value.signStatus ? (
                        <p>
                          <Icon name="circle" color="green" size="tiny" />
                          Signed
                        </p>
                      ) : (
                        <p>
                          <Icon name="circle" color="red" size="small" /> Pending
                        </p>
                      )}
                      {/* <p>
                        <span className="sign-pending">
                          {" "}
                          <Icon name="circle" color="red" size="tiny" />
                        </span>
                        Pending
                      </p> */}
                    </div>
                    <div className="boxes hover">
                      <img src={Download} alt="" srcset="" />
                      <p>Download</p>
                    </div>
                  </div>
                </div>
                </Link>
              </>
            );
          })
        ) : (
          <Loader active size="medium">
            Loading
          </Loader>
        )}
      </div>

      {/* my code end */}
    </div>
  );
}
