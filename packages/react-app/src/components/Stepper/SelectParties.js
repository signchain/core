/* eslint-disable */

import React, {useState} from "react";
import "./SlectParties.css";
import {Checkbox, Dropdown, Icon, Input} from "semantic-ui-react";
import jenny from "../../images/jenny.jpg";

const SelectParties = ({ users, parties, notaries, setParties, setCC, setDocNotary }) => {
  const [displayNotary, setDisplayNotary] = useState(false);
  const [displayCC, setDisplayCC] = useState(false);

  return (
    <div className="parties__container">
      <div className="wrapper" style={{ padding: "14px" }}>
        <div style={{ marginBottom: "14px" }}>
          <Dropdown
            placeholder="Select Party"
            fluid
            multiple
            search
            selection
            options={users.map(user => {
              return {
                key: user.address,
                text: user.name,
                value: user,
                image: { avatar: true, src: jenny },
              };
            })}
            onChange={(event, data) => setParties(data.value)}
          />
        </div>

        <div style={{ display: "flex", marginTop: "18px" }}>
          <Checkbox
            label="Add Notary (optional)"
            checked={displayNotary}
            onChange={() => {
              setDisplayNotary(!displayNotary);
            }}
          />
        </div>
        {displayNotary ? (
          <div>
            <Dropdown
              style={{ marginTop: "18px" }}
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
          </div>
        ) : (
          <div />
        )}
        <div style={{ display: "flex", marginTop: "18px" }}>
          <Checkbox
            label="Add CC (optional)"
            checked={displayCC}
            fluid
            onChange={() => {
              setDisplayCC(!displayCC);
            }}
          />
        </div>

        {displayCC ? (
          <div>
            <Input
              style={{ marginTop: "18px", width: "100%" }}
              iconPosition="left"
              placeholder="Email"
              fluid
              onChange={(error, data) => {
                setCC(data.value);
              }}
            >
              <Icon name="at" />
              <input />
            </Input>
          </div>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default SelectParties;
