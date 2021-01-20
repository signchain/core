// /* eslint-disable */
import React, { useEffect, useState } from "react";

import { Row, Col } from "antd";
import { UserOutlined, MailOutlined, FieldTimeOutlined } from "@ant-design/icons";
import { definitions } from "../ceramic/config.json";

import { Loader, Grid, Card, Icon, Table } from "semantic-ui-react";
// import { Form, Input, Button, Checkbox } from "antd";
import "./Profile.css";
const index = require("../lib/e2ee.js");

export default function Profile({ ceramic, idx }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    async function getUserData() {
      try {
        if (idx) {
          const data = await idx.get(definitions.profile, idx.id);
          setUser(data);
          console.log(data);
        }
      } catch (err) {
        console.log(err);
      }
    }
    getUserData();
  }, [idx]);

  return user ? (
    <>
      <Row>
        <Col span={24}>
          <div className="profileContainer">
            <div className="profile">
              <img src="https://react.semantic-ui.com/images/avatar/large/patrick.png" alt="" />
              <h2>{user.name}</h2>
              <h3>
                <span className="addressSpan">{idx.id}</span>{" "}
              </h3>

              <div className="profile-info">
                <Row>
                  <Col span={8}>
                    <UserOutlined style={{ marginRight: "4px" }} /> {user.notary ? "Notary" : "Party"}
                  </Col>
                  <Col span={8}>
                    <MailOutlined style={{ marginRight: "4px" }} />
                    {user.email}
                  </Col>
                  <Col span={8}>
                    <FieldTimeOutlined style={{ marginRight: "4px" }} /> 2020 October
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </>
  ) : (
    <Loader active size="medium">
      Fetching profile
    </Loader>
  );
}
