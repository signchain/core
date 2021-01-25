import React, { useEffect, useState } from "react";
import { Table, Icon, Image, Button, Label, Loader, Message } from "semantic-ui-react";

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
import jenny from "../../images/jenny.jpg";

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
                  <h3 className=" header-title">{document.title}</h3>
                </div>

                <div class="progress-container ">
                  {/* conditional rendering */}
                  {
                  document.signStatus ? 
                  <Label color="green">Signed</Label> :
                  <Label>Pending</Label>
                  }
                </div>

                {/* <div className="note">
                  <div className="status"> */}
                  <Message
                    size="tiny"
                    color="violet"
                >
                  Please Download the Attachments and read it before signing..
                  </Message>  
                  {/* </div>
                </div> */}

                {/* table */}
                <div className="sign-button">
                  {document.notary === caller.address && !document.notarySigned ? (
                    <Button
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
                      color="green"
                      icon
                      labelPosition="left"
                      onClick={() => signDocument(document.hash, document.docId)}
                    >
                      <Icon name="signup" />
                      Sign Document
                    </Button>
                  ) : (
                    <Button disabled color="green">
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
                  <h3 className="title-message">{document.title}</h3>
                </div>

                <div class="progress-container ">
                  <span class="heading">Shared Date</span>
                  <h3 className="created-by">{document.timestamp}</h3>
                </div>

                <div className="actions">
                  <div className="status">
                    <div className="docs-icon">
                      <img src={Attachments} alt="" srcset="" />
                    </div>
                    <h6 className="heading">{document.fileName}</h6>
                  </div>

                  <div className="status">
                    <div
                      className="docs-icon"
                      onClick={() => downloadFile(document.title, document.key, document.documentLocation)}
                    >
                      <img src={Download} alt="" srcset="" />
                    </div>
                    <h6 className="heading">Download</h6>
                  </div>

                  {document.notary ? (
                    document.notarySigned ? (
                      <div className="status">
                        <div className="docs-icon">
                          <img src={Sign} alt="" srcSet="" />
                        </div>
                        <h6 className="heading">
                          <Icon name="circle" color="green" /> Notarized{" "}
                        </h6>
                      </div>
                    ) : (
                      <div className="status">
                        <div className="docs-icon">
                          <img src={Sign} alt="" srcSet="" />
                        </div>
                        <h6 className="heading">
                          <Icon name="circle" color="red" /> Not Notarized{" "}
                        </h6>
                      </div>
                    )
                  ) : null}
                </div>

                {/* table */}

                <Table singleLine striped>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell className="table-header">Signers</Table.HeaderCell>
                      <Table.HeaderCell className="table-header"> Status</Table.HeaderCell>
                      <Table.HeaderCell className="table-header">Signed On</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                  

                    {
                      document.sharedTo.map((value) => {
                        return(
                          <Table.Row>
                            <Link to={`/profile/${encodeURIComponent(value.did)}`}>
                            <Table.Cell className="table-header">
                            <Image avatar src={jenny} /> 
                              {value.name}
                            </Table.Cell>
                            </Link>
                            <Table.Cell>
                              <div>
                                {
                                  value.partySigned ?
                                    <>
                                      <Icon name="circle" color="green" /> Signed
                                    </>:
                                    <>
                                      <Icon name="circle" color="red" /> Pending
                                    </>
                                }
                              </div>
                            </Table.Cell>

                          <Table.Cell className="table-header">{value.timestamp}</Table.Cell>
                        </Table.Row>
                      );
                    })}
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
