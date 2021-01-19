/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Button, Icon, Loader, Table, Modal, Step, Card, Image, Header } from "semantic-ui-react";
import { Badge } from "antd";
import { getAllUsers, getAllFile, downloadFiles, attachSignature, notarizeDoc, getCredentials } from "../lib/threadDb";
import { Link } from "react-router-dom";
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
    console.log("Docs:", document);
    if (document.length > 0) {
      setDocs(document);
    }
    setLoading(false);
  };

  return (
    <>
      <div class="courses-container">
        <div class="course">
          <div class="course-preview">
            <h6>Title</h6>
            <h2>Rental Agreement</h2>
          </div>
          <div class="course-info">
            <div class="progress-container">
              <span class="progress-text">20-01-2020</span>
            </div>
            <h6>Shared By</h6>
            <h2>Koushith</h2>
            <div className="read-more">
              <div className="boxes">
                <div className="docs-icon">
                  <img src={File} alt="" srcset="" />
                </div>
                <p> test</p>
              </div>
              <button class="btn">Read More</button>
            </div>
          </div>
        </div>
      </div>

      <div className="main__container">
        {/* my code */}

        <h3>My Documents</h3>
        <div className="documents__container">
          {!loading ? (
            docs.map(value => {
              return (
                <>
                  <Link
                    to={`/documents/${encodeURIComponent(value.documentId)}/${encodeURIComponent(value.signatureId)}`}
                  >
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
    </>
  );
}
