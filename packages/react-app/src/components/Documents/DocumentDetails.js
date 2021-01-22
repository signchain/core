import React, { useEffect, useState } from "react";
import {
  Table,
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Segment,
  Item,
  Icon,
  Button, Loader,
} from "semantic-ui-react";

import { WarningStatus, SignSuccess } from "./WarningNote";
import {
  DocumentContainer,
  DocumentHeader,
  HeaderContainer,
  TitleHeading,
  DocumentTable,
} from "../styles/DocumentDetails.Style";
import { attachSignature, downloadFiles, getAllUsers, getSingleDocument, notarizeDoc } from "../../lib/threadDb";
import { Link } from "react-router-dom";

const DocumentDetails = props => {
  const loggedUser = localStorage.getItem("USER");
  const userInfo = JSON.parse(loggedUser);
  const documentId = decodeURIComponent(props.match.params.doc);
  const signatureId = decodeURIComponent(props.match.params.sig);
  const did = encodeURIComponent(userInfo.did)
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
        setDocument(documentInfo)
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
    const password = Buffer.from(new Uint8Array(props.seed)).toString("hex")
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
        <DocumentHeader>
          <HeaderContainer>
            <div className="document-title-section">
              <TitleHeading>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, corrupti.</TitleHeading>

              <p className="description">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos exercitationem aspernatur illum aut rerum
                atque inventore alias provident consequuntur ea quasi ducimus asperiores
              </p>
            </div>
            <div className="pending-btn">
              <p>
                {/* conditional render based on status */}
                <span className="docs-status-pending">Pending</span>
                {/* <span className="docs-status-success">Signed</span> */}
              </p>
            </div>
          </HeaderContainer>
        </DocumentHeader>

        {!loading ? (
        <DocumentTable>
          <Link to={`/profile/${encodeURIComponent(document.createdByDid)}`}>
          <div className="name-content">
            <div className="icon-img">
              <img
                className="img-container"
                src="https://react.semantic-ui.com/images/avatar/large/patrick.png"
                alt=""
                srcset=""
              />
            </div>
            <div className="shared-info">
              <p className="data">{document.createdBy}</p>
            </div>
          </div>
          </Link>
          {
            document.sharedTo.map(value => {
              return(
                <Link to={`/profile/${encodeURIComponent(value.did)}`}>
                  <div className="name-content">
                    <div className="icon-img">
                      <img
                        className="img-container"
                        src="https://react.semantic-ui.com/images/avatar/large/patrick.png"
                        alt=""
                        srcset=""
                      />
                    </div>
                    <div className="shared-info">
                      <p className="data">{value.name}</p>
                    </div>
                  </div>
                  </Link>
              )
            })
          }
          <Table singleLine striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className="table-header">Document Name</Table.HeaderCell>
                <Table.HeaderCell className="table-header"> Status</Table.HeaderCell>
                <Table.HeaderCell className="table-header">Created On</Table.HeaderCell>

                {
                  document.notary ? <Table.HeaderCell className="table-header">Notarized </Table.HeaderCell>
                    : null
                }
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

                {
                  document.notary ? (
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
                  ) : null
                }

                <Table.Cell collapsing textAlign="right">
                  {/*<Button icon="download" />*/}
                  <Button loading={downloading === document.hash} icon="download" onClick={() => downloadFile(document.title,
                    document.key, document.documentLocation)} />
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
          {/* conditional rendering goes here- hide for the one who initiated */}
          <WarningStatus />
          {/* <SignSuccess /> */}
          <div className="sign-btn">
            {document.notary === caller.address && !document.notarySigned ? (
              <Button basic color="blue" icon labelPosition="left" onClick={() => notarizeDocument(document.docId,
                document.hash)}>
                <Icon name="signup" />
                Notarize
              </Button>
            ) : !document.partySigned ? (
              <Button basic color="blue" icon labelPosition="left" onClick={() => signDocument(document.hash,
                document.docId)}>
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
        ):(
          <Loader active size="medium">
            Loading
          </Loader>
        )}
      </DocumentContainer>
    </>
  );
};

export default DocumentDetails;
