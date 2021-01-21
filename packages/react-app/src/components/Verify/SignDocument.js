import React, { useState, useEffect } from "react";
import { Button, Form, Input, Dropdown } from "semantic-ui-react";
import { DocsContainer, InputGroup, Title } from "../styles/ShareDocs.Style";

import fleek from "../../images/fleek.png";
import AWS from "../../images/aws.png";
import filecoin from "../../images/filecoin.png";

const index = require("../../lib/e2ee.js");

const fileStorage = [
  { name: "AWS", image: AWS },
  { name: "Fleek", image: fleek },
  { name: "Slate", image: filecoin },
];

function SignDocs() {
  const [selected, setSelected] = useState(false);
  const [storageType, setStorage] = useState("Fleek");
  const [displayNotary, setDisplayNotary] = useState(false);
  const [displayCC, setDisplayCC] = useState(false);
  return (
    <DocsContainer>
      <div className="container">
        <Title>Sign & Share</Title>
        <Form>
          <InputGroup>
            <label className="input-group">Select Party</label>
            <Dropdown placeholder="Select Party" selection label="Select Party" fluid style={{ marginTop: "4px" }} />
          </InputGroup>
          <InputGroup>
            <label className="input-group">Select Storage</label>
            <Dropdown placeholder="Select Storage Provider" fluid selection style={{ marginTop: "4px" }} />
          </InputGroup>

          <Form.Input label="Select File" type="file" />

          <Form.Input label="Document Title" placeholder="Enter Document Title" />
          {/* uncomment */}
          {/* 
          {selected && !submitting ? <Form.Input label="Document Title" placeholder="Enter Document Title" /> : null} */}

          <Form.Group widths={2}>
            <Form.Checkbox
              label="Add Notary (Optional)"
              // checked={displayNotary}
              // onChange={() => {
              //   setDisplayNotary(!displayNotary);
              // }}
            />
            <Form.Checkbox
              label="Add CC (Optional)"
              // checked={displayCC}
              // onChange={() => {
              //   setDisplayCC(!displayCC);
              // }}
            />
          </Form.Group>

          {/* uncomment */}

          {/* <Form.Group>
            <label htmlFor>Select Notary</label>
            {displayNotary ? (
              <Dropdown
                placeholder="Select a Notary"
                fluid
                search
                selection
                options={notaries.map(user => {
                  return {
                    key: user.address,
                    text: user.name,
                    value: user,
                    image: { avatar: true, src: jenny },
                  };
                })}
                onChange={(event, data) => {
                  const allParties = parties;
                  allParties.push(data.value);
                  setParties(allParties);
                  setDocNotary(data.value);
                }}
              />
            ) : null}
          </Form.Group> */}

          {/* <Form.Group>
            <label htmlFor>Add CC</label>
            {displayCC ? (
            
                <Input
                 
                  iconPosition="left"
                  placeholder="Email"
                  onChange={(error, data) => {
                    setCC(data.value);
                  }}
                >
                  <Icon name="at" />
                  <input />
                </Input>
             
            ) : (
             null
            )}
          </Form.Group> */}

          <Button
            className="submit-btn"
            style={{ background: "#4c51bf", color: "#fff", float: "right", marginTop: "48px" }}
          >
            Sign & Share
          </Button>
        </Form>
      </div>
    </DocsContainer>
  );
}

export default SignDocs;
