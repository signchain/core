// /* eslint-disable */
import React, { useEffect, useState } from "react";

import { Row, Col } from "antd";
import { UserOutlined, MailOutlined, FieldTimeOutlined } from "@ant-design/icons";
import { definitions } from "../ceramic/config.json";

import { Loader, Icon, Header, Segment } from "semantic-ui-react";
// import { Form, Input, Button, Checkbox } from "antd";
import "./Profile.css";
const index = require("../lib/e2ee.js");

const UserProfiles = props => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const id = decodeURIComponent(props.match.params.did);

  useEffect(() => {
    async function getUserData() {
      try {
        if (props.idx) {
          const data = await props.idx.get(definitions.profile, id);
          setUser(data);
          setUserLoading(false);
          if(data){
            console.log("data fetched")
          }else{
            console.log("Something is wrong with IDX")
          }
        }else {
            const data = JSON.parse(localStorage.getItem("USER"))
            console.log(data)
        }
      } catch (err) {
        console.log(err);
      }
    }
    getUserData();
  }, [props.idx]);

  return userLoading ? (
    user ?
    <>
      <Row>
        <Col span={24}>
          <div className="profileContainer">
            <div className="profile">
              <img src="https://react.semantic-ui.com/images/avatar/large/patrick.png" alt="" />
              <h2>{user.name}</h2>
              <h3>
                <span className="addressSpan">{id}</span>{" "}
              </h3>
              <h3>
                <span className="addressSpan">{user.userAddress}</span>{" "}
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
                    <FieldTimeOutlined style={{ marginRight: "4px" }} /> {user.joindate}
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </Col>
      </Row> 
    </> :
    <Segment placeholder>
    <Header icon>
      <Icon name='search' color='violet'/>
      No profile found :(.
    </Header>
    <Segment.Inline>
      There was an issue fetching the user profile.
    </Segment.Inline>
  </Segment>
  ) : (
    <Loader active size="medium">
      Fetching profile
    </Loader>
  );
}

export default UserProfiles;
