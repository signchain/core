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
import File from "../../images/icons/Files.svg";

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
      <DocumentContainer>
        {/* *********************** */}
        <h3 style={{ textAlign: "center", paddingTop: "14px", color: "#718096" }}>Document Details</h3>

        {!loading ? (
          <DetailsInfo>
            <div class="Details-card">
              <div class="Details-card-info">
                <div class="progress-container ">
                  <span class="heading">Shared With</span>
                  <h3 className="created-by">Koushith</h3>
                </div>
                <h6 className="heading">Shared By</h6>
                <Link to={`/profile/${did}`}>
                  <h3 className="created-by">{document.createdBy}</h3>
                </Link>
                <DocsTitle>
                  <span class="heading">Title</span>
                  <h3 className="created-by"> {document.title}</h3>
                </DocsTitle>

                <div className="actions">
                  <div className="status">
                    <div className="docs-icon">
                      <img src={File} alt="" srcset="" />
                    </div>
                    <h6 className="heading">{document.title}</h6>
                  </div>
                  <div className="status">
                    <div className="docs-icon">
                      <img src={Sign} alt="" srcset="" />
                    </div>
                    {document.partySigned ? (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Icon name="circle" color="green" size="tiny" />
                        <h6 className="heading">Signed</h6>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Icon name="circle" color="red" size="tiny" /> <h6 className="heading"> Pending</h6>
                      </div>
                    )}
                  </div>

                  <div className="status">
                    <div className="docs-icon">
                      <img src={Notarize} alt="" srcset="" />
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Icon name="circle" color="red" size="tiny" /> <h6 className="heading"> Not Notirized</h6>
                    </div>
                  </div>

                  <div className="status">
                    <Button
                      loading={downloading === document.hash}
                      icon="download"
                      onClick={() => downloadFile(document.title, document.key, document.documentLocation)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="timpestamp">
              <Step.Group vertical>
                <Step>
                  <Icon name="clock outline " />
                  <Step.Content>
                    <Step.Description>Shared On</Step.Description>
                    <p>21-01-2020</p>
                  </Step.Content>
                </Step>

                <Step>
                  <Icon name="clock outline " />
                  <Step.Content>
                    <Step.Description>Signed at</Step.Description>
                  </Step.Content>
                </Step>

                <Step>
                  <Icon name="clock outline" />
                  <Step.Content>
                    <Step.Description>Notarized at</Step.Description>
                  </Step.Content>
                </Step>
              </Step.Group>
            </div>
          </DetailsInfo>
        ) : (
          <Loader active size="medium">
            Loading
          </Loader>
        )}

        {/* ******************* delete this snip */}
        {!loading ? (
          <DocumentTable>
            <Table singleLine striped>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell className="table-header">Document Name</Table.HeaderCell>
                  <Table.HeaderCell className="table-header"> Status</Table.HeaderCell>
                  <Table.HeaderCell className="table-header">Created On</Table.HeaderCell>

                  {document.notary ? <Table.HeaderCell className="table-header">Notarized </Table.HeaderCell> : null}
                  <Table.HeaderCell className="table-header">Actions </Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row>
                  <Table.Cell collapsing>
                    <span style={{ color: " #0000EE", cursor: "pointer" }}>
                      <Icon name="file outline" />
                      {document.title}
                    </span>
                  </Table.Cell>

                  <Table.Cell>
                    {document.partySigned ? (
                      <div className="table-header">
                        <Icon name="circle" color="green" />
                        Signed
                      </div>
                    ) : (
                      <div>
                        <Icon name="circle" color="red" /> Pending
                      </div>
                    )}
                  </Table.Cell>

                  <Table.Cell className="table-header">{document.timestamp}</Table.Cell>

                  {document.notary ? (
                    <Table.Cell className="table-header">
                      {document.notarySigned ? (
                        <div>
                          <Icon name="circle" color="green" /> Notarized
                        </div>
                      ) : (
                        <div>
                          <Icon name="circle" color="red" /> Not yet Notarized
                        </div>
                      )}
                    </Table.Cell>
                  ) : null}

                  <Table.Cell collapsing textAlign="right">
                    {/*<Button icon="download" />*/}
                    <Button
                      loading={downloading === document.hash}
                      icon="download"
                      onClick={() => downloadFile(document.title, document.key, document.documentLocation)}
                    />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
            {/* conditional rendering goes here- hide for the one who initiated */}
            <WarningStatus />
            {/* <SignSuccess /> */}
            <div className="sign-btn">
              {document.notary === caller.address && !document.notarySigned ? (
                <Button
                  basic
                  color="blue"
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
                  color="blue"
                  icon
                  labelPosition="left"
                  onClick={() => signDocument(document.hash, document.docId)}
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
            </div>
          </DocumentTable>
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
