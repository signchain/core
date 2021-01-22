import React, { useEffect, useState } from "react";
import { Table, Icon, Button, Loader, Step } from "semantic-ui-react";

import { WarningStatus, SignSuccess } from "./WarningNote";
import {
  DocumentContainer,
  DocumentHeader,
  HeaderContainer,
  TitleHeading,
  DocumentTable,
  DetailsInfo,
  DocsTitle,
  DetailsContainer,
} from "../styles/DocumentDetails.Style";
import { attachSignature, downloadFiles, getAllUsers, getSingleDocument, notarizeDoc } from "../../lib/threadDb";
import { Link } from "react-router-dom";
import Sign from "../../images/icons/Sign.svg";
import Download from "../../images/icons/Download.svg";
import Notarize from "../../images/icons/notarize.svg";
import Attachments from "../../images/icons/attachments.svg";
import LogoAvatar from "../../images/icons/logoavatar.svg";

import stepper from "../Stepper/Steps";

const DocumentDetails = props => {
  const loggedUser = localStorage.getItem("USER");
  const userInfo = JSON.parse(loggedUser);
  const documentId = decodeURIComponent(props.match.params.doc);
  const signatureId = decodeURIComponent(props.match.params.sig);
  const did = encodeURIComponent(userInfo.did);
  const [caller, setCaller] = useState({});
  const [document, setDocument] = useState(null);
  const [downloading, setDownloading] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const caller = await getAllUsers(userInfo.publicKey);
        setCaller(caller.caller);
        const documentInfo = await getSingleDocument(
          props.address,
          props.tx,
          props.writeContracts,
          documentId,
          signatureId,
        );
        console.log("DocumentInfo:", documentInfo);
        setDocument(documentInfo);
        setLoading(false);
      } catch (e) {
        console.log("Error:", e);
      }
    }
    load();
  }, []);

  const downloadFile = (name, key, location) => {
    setDownloading(name);
    console.log("docment:", location);
    const password = Buffer.from(new Uint8Array(props.seed)).toString("hex");
    downloadFiles(name, key, userInfo.address, location, password).then(result => {
      setDownloading(null);
    });
  };

  const signDocument = async (docHash, docId) => {
    const result = await attachSignature(docId, props.userProvider.getSigner(), caller, docHash);
  };

  const notarizeDocument = async (docId, docHash) => {
    const result = await notarizeDoc(
      docId,
      docHash,
      props.tx,
      props.writeContracts,
      props.userProvider.getSigner(),
      caller,
    );
  };

  return (
    <>
      <DocumentHeader>
        {!loading ? (
          <DetailsInfo>
            <div class=" header-wrapper">
              <div class="Details-card-info header-container">
                <div class="title-left">
                  <h3 className=" header-title">#Rental Agreement</h3>
                </div>

                <div class="progress-container ">
                  {/* conditional rendering */}
                  <Button>Pending</Button>
                  {/* <Button color="green">Signed</Button> */}
                </div>

                <div className="note">
                  <div className="status">
                    <p>Please Download the Attachments and read it before signing.</p>
                  </div>
                </div>

                {/* table */}
                <div className="sign-button">
                  {document.notary === caller.address && !document.notarySigned ? (
                    <Button
                      basic
                      color="green"
                      icon
                      labelPosition="left"
                      onClick={() => notarizeDocument(document.docId, document.hash)}
                    >
                      <Icon name="signup" />
                      Notarize
                    </Button>
                  ) : !document.partySigned ? (
                    <Button
                      basic
                      color="green"
                      icon
                      labelPosition="left"
                      onClick={() => signDocument(document.hash, document.docId)}
                    >
                      <Icon name="signup" />
                      Sign Document
                    </Button>
                  ) : (
                    <Button disabled basic color="green" icon labelPosition="left">
                      <Icon name="signup" />
                      Sign Document
                    </Button>
                  )}
                </div>

                {/* ********* */}
              </div>
            </div>
          </DetailsInfo>
        ) : (
          <Loader active size="medium">
            Loading
          </Loader>
        )}
      </DocumentHeader>

      <DocumentContainer>
        {!loading ? (
          <DetailsInfo>
            <div class="Details-card">
              <div class="Details-card-info">
                <div class="title-left">
                  <img src={LogoAvatar} alt="" srcset="" />
                  <h3 className="title-message">#Rental Agreement</h3>
                </div>

                <div class="progress-container ">
                  <span class="heading">Shared Date</span>
                  <h3 className="created-by">22-01-2020</h3>
                </div>

                <div className="actions">
                  <div className="status">
                    <div className="docs-icon">
                      <img src={Attachments} alt="" srcset="" />
                    </div>
                    <h6 className="heading">{document.title}</h6>
                  </div>

                  <div className="status">
                    <div className="docs-icon">
                      <img src={Download} alt="" srcset="" />
                    </div>
                    <h6 className="heading">Download</h6>
                  </div>
                </div>

                {/* table */}

                <Table singleLine striped>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell className="table-header">Shared With</Table.HeaderCell>
                      <Table.HeaderCell className="table-header"> Type</Table.HeaderCell>
                      <Table.HeaderCell className="table-header">Signed On</Table.HeaderCell>

                      <Table.HeaderCell className="table-header">Signature Status </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    <Table.Row>
                      <Table.Cell className="table-header">Yathish</Table.Cell>

                      <Table.Cell>
                        <div>
                          <Icon name="circle" color="red" /> Pending
                        </div>
                      </Table.Cell>

                      <Table.Cell className="table-header">ghsfgsfd</Table.Cell>

                      <Table.Cell className="table-header">
                        <div>
                          <Icon name="circle" color="green" /> Notarized
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>

                {/* ********* */}
              </div>
            </div>
          </DetailsInfo>
        ) : (
          <Loader active size="medium">
            Loading
          </Loader>
        )}
      </DocumentContainer>
    </>
  );
};

export default DocumentDetails;
