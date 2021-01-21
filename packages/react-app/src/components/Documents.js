/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Button, Icon, Loader, Table, Modal, Step, Card, Image, Header } from "semantic-ui-react";

import { getAllUsers, getAllFile, downloadFiles, attachSignature, notarizeDoc, getCredentials } from "../lib/threadDb";
import { Link } from "react-router-dom";
//import "./Documents.css";
import { DetailsContainer, DetailsCard } from "./styles/DocumentDetails.Style";
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
      <DetailsCard>
        <h2 className="docs-heading">My Documents</h2>
        {!loading ? (
          docs.map(value => {
            return (
              <>
                <DetailsContainer>
                  <div class="Details-card">
                    <div class="Details-card-preview">
                      <h6>Title</h6>
                      <h2>{value.title}</h2>
                    </div>
                    <div class="Details-card-info">
                      <div class="progress-container">
                        <span class="heading">{value.date}</span>
                      </div>
                      <h6 className="heading">Shared By</h6>
                      <h2 className="meta-text">{value.createdBy}</h2>
                      <div className="read-more">
                        <div className="status">
                          <div className="docs-icon">
                            <img src={File} alt="" srcset="" />
                            <h6 className="heading">{value.fileName}</h6>
                          </div>
                        </div>
                        <div className="status">
                          <div className="docs-icon">
                            <img src={Download} alt="" srcset="" />
                            <h6 className="heading">Download</h6>
                          </div>
                        </div>
                        <Link
                          to={`/documents/${encodeURIComponent(value.documentId)}/${encodeURIComponent(
                            value.signatureId,
                          )}`}
                        >
                          <Button class="btn">Read More</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </DetailsContainer>
              </>
            );
          })
        ) : (
          <Loader active size="medium">
            Loading
          </Loader>
        )}
      </DetailsCard>
    </>
  );
}
