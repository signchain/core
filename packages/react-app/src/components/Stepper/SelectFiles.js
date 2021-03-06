/* eslint-disable */

import React, {useState} from "react";
import "antd/dist/antd.css";
import upload from "../../images/upload.png";
import {message, Upload} from "antd";
import {Input} from "semantic-ui-react";

import fleek from "../../images/fleek.png";
import AWS from "../../images/aws.png";
import filecoin from "../../images/filecoin.png";

const index = require("../../lib/e2ee.js");

const { Dragger } = Upload;

const fileStorage = [
  { name: "AWS", image: AWS },
  { name: "Fleek", image: fleek },
  { name: "Slate", image: filecoin },
];

const SelectFiles = ({ setFileInfo, setSubmitting, setTitle, submitting }) => {
  const [selected, setSelected] = useState(false);
  const [storageType, setStorage] = useState(process.env.REACT_APP_STORAGE);

  const props = {
    name: "file",
    multiple: true,
    customRequest: data => {
      uploadFile(data.file);
    },
    onChange(submitting) {
      if (selected) {
        message.success(` file uploaded successfully.`);
      } else if (!submitting) {
        message.error(`file upload failed.`);
      }
    },
  };

  const uploadFile = async file => {
    let partiesInvolved = [];
    setSelected(true);
    setSubmitting(true);
    const receipt = await index.uploadDoc(file, "123", setSubmitting, storageType, setFileInfo);
    if (receipt) {
      return true;
    }
  };

  return (
    <div className="parties__container" style={{ background: "#fff" }}>
      <div className="wrapper" style={{ padding: "14px", background: "#fff" }}>
        <div style={{ marginBottom: "14px" }}>
          <Dragger {...props} style={{ border: "1px solid #22242626", background: "#fff" }}>
            <p className="ant-upload-drag-icon">
              <img src={upload} alt="" srcset="" />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
          </Dragger>
        </div>
        {selected && !submitting ? (
          <Input
            fluid
            style={{ marginTop: "18px" }}
            placeholder="Enter document title"
            onChange={(event, data) => {
              setTitle(data.value);
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

export default SelectFiles;
