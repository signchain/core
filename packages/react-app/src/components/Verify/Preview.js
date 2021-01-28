/* eslint-disable */

import React, {useEffect} from "react";
import {Button} from 'antd';
import {Header, Icon, Loader, Segment} from 'semantic-ui-react'
import "./Preview.css";

import {getDocumentByHash} from "../../lib/threadDb";


const Preview = ({ submitting, setSubmitting, fileHash }) => {
  

  useEffect(() => {
    async function getDocument() {
    if (fileHash) {
      setSubmitting(true)
      const documentDetails = await getDocumentByHash(fileHash)
      if(documentDetails.length) {
      window.location.href = `/#/documents/${documentDetails[0]._id}/${documentDetails[0].signatureId}`
      }
      setSubmitting(false)
    }
  }
  getDocument() 
      
  }, []);

  return (
    !submitting ?
      <div>
      <Header icon>
        <Icon name='search' />
        We don't have any documents matching your query.
      </Header>
      <Segment.Inline>
      <Button type="primary"  style={{ margin: '0 8px' }} className="button">Search again</Button>
      </Segment.Inline>
    </div>:
    <Loader active size="medium">
    Searching document ...
  </Loader>
  );
};

export default Preview;
