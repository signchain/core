/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Button, Icon, Loader, Segment, Header } from "semantic-ui-react";
import { getAllFile} from "../lib/threadDb";
import { Link } from "react-router-dom";
import { DetailsContainer, DetailsCard, DocsTitle } from "./styles/DocumentDetails.Style";
import File from "./../images/icons/Files.svg";
import Download from "./../images/icons/Download.svg";

import { Collapse } from "antd";
const { Panel } = Collapse;

export default function Documents(props) {
  const loggedUser = localStorage.getItem("USER");
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.writeContracts) {
      props.writeContracts.Signchain.on("DocumentSigned", (author, oldValue, newValue, event) => {
        getAllDoc();
      });
      props.writeContracts.Signchain.on("DocumentNatarized", (author, oldValue, newValue, event) => {
        getAllDoc();
      });
      getAllDoc();
    }
  }, [props.writeContracts]);

  const getAllDoc = async () => {
    setLoading(true);
    const userInfo = JSON.parse(loggedUser);
    const document = await getAllFile(userInfo.publicKey, props.address, props.tx, props.writeContracts);
    if (document.length > 0) {
      setDocs(document);
    }
    setLoading(false);
  };

  return (
    <>
      <DetailsCard>
        <h2 className="docs-heading">My Documents</h2>
        {!loading ? 
        (docs.length ? 
        (
          docs.map(value => {
            return (
              <>
                <Link
                  to={`/documents/${encodeURIComponent(value.documentId)}/${encodeURIComponent(value.signatureId)}`}
                >
                  <DetailsContainer>
                    <div class="Details-card">
                      <div class="Details-card-info">
                        <div class="progress-container">
                          <span class="heading">Shared with</span>
                          {
                            value.sharedWith.length === 0 ? 
                            (<h3 className="created-by">NA</h3>) : 
                            (<h3 className="created-by">{value.sharedWith[0].name}</h3>)
                          }
                          
                        </div>
                        <h6 className="heading">Shared By</h6>
                        <h3 className="created-by">{value.createdBy.name}</h3>

                        <DocsTitle>
                          <span class="heading">Title</span>
                          <h3 className="created-by">{value.title}</h3>
                        </DocsTitle>

                        <div className="read-more">
                          <div className="status">
                            <div className="docs-icon">
                              <img src={File} alt="" srcset="" />
                            </div>
                            <h6 className="heading">{value.fileName}</h6>
                          </div>
                          <div className="status">
                            <div className="docs-icon">
                              <img src={Download} alt="" srcset="" />
                            </div>
                            <h6 className="heading">Download</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DetailsContainer>
                </Link>
              </>
            );
          })
        ) : 
        <Segment placeholder>
          <Header icon>
            <Icon name='search' color='violet'/>
            No documents for you :P.
          </Header>
          <Segment.Inline>
            <Link to="/sign">
            <Button>Sign a document</Button>
            </Link>
          </Segment.Inline>
        </Segment>
        
        ): (
          <Loader active size="medium">
            Loading
          </Loader>
        )}
      </DetailsCard>
    </>
  );
}
