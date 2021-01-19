import React, {useEffect, useState} from "react";
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
  Button,
} from "semantic-ui-react";

import { WarningStatus, SignSuccess } from "./WarningNote";
import {
  DocumentContainer,
  DocumentHeader,
  HeaderContainer,
  TitleHeading,
  DocumentTable,
} from "../styles/DocumentDetails.Style";
import {attachSignature, downloadFiles, getAllUsers, getSingleDocument, notarizeDoc} from "../../lib/threadDb";

const DocumentDetails = (props) => {

  const password = localStorage.getItem("password");
  const loggedUser = localStorage.getItem("USER");
  const userInfo = JSON.parse(loggedUser);
  const documentId = decodeURIComponent(props.match.params.doc)
  const signatureId = decodeURIComponent(props.match.params.sig)
  const [document, setDocument] = useState(null)
  const [caller, setCaller] = useState({});

  useEffect(()=>{
    async function load(){
      try{
        const caller = await getAllUsers(userInfo.publicKey)
        setCaller(caller)
        const documentInfo = await getSingleDocument(props.address, props.tx,props.writeContracts, documentId, signatureId)
        console.log("DocumentInfo:", documentInfo)
        setDocument(documentInfo)
      }catch (e) {
        console.log("Error:",e)
      }
    }
    load()
  },[])

  const downloadFile = (name, key, location) => {
    //setDownloading(name);
    console.log("docment:", location);
    downloadFiles(name, key, userInfo.address, location, password).then(result => {
      //setDownloading(null);
    });
  };

  const signDocument = async (docHash, docId) => {
    const result = await attachSignature(docId, props.userProvider.getSigner(), caller, docHash);
  };

  const notarizeDocument = async (docId, docHash) => {
    const result = await notarizeDoc(docId, docHash, props.tx, props.writeContracts, props.userProvider.getSigner(), caller);
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

      <DocumentTable>
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
            <p className="data">Koushith B.R</p>
          </div>
        </div>
        <Table singleLine striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell className="table-header">Document Name</Table.HeaderCell>
              <Table.HeaderCell className="table-header"> Status</Table.HeaderCell>
              <Table.HeaderCell className="table-header">Created On</Table.HeaderCell>
              <Table.HeaderCell className="table-header">Party</Table.HeaderCell>
              <Table.HeaderCell className="table-header">Notarized </Table.HeaderCell>
              <Table.HeaderCell className="table-header">Actions </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.Cell collapsing>
                <span style={{color: " #0000EE", cursor: "pointer"}}>
                  <Icon name="file outline"/> hello
                </span>
              </Table.Cell>

              <Table.Cell>
                <div className="table-header">
                  <Icon name="circle" color="green"/>
                  Signed
                </div>
                {/* conditional render */}
                {/* <div>
                          <Icon name="circle" color="red" /> Pending
                        </div> */}
              </Table.Cell>

              <Table.Cell className="table-header">Created On date</Table.Cell>

              <Table.Cell className="table-header">Party Name</Table.Cell>
              <Table.Cell className="table-header">
                <div>
                  <Icon name="circle" color="red"/> Pending
                </div>
              </Table.Cell>
              <Table.Cell collapsing textAlign="right">
                <Button icon="download"/>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        {/* conditional rendering goes here */}
        <WarningStatus/>
        {/* <SignSuccess /> */}
        <div className="sign-btn">
          {/* Conditional rendering */}
          <Button primary>Sign Now</Button>
          {/* <Button primary>Notarizee</Button> */}
        </div>
      </DocumentTable>
    </DocumentContainer>
  </>
  )
};

export default DocumentDetails;
