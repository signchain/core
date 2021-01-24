// /* eslint-disable */
import React, { useEffect, useState } from "react";
import { UserOutlined, MailOutlined, FieldTimeOutlined } from "@ant-design/icons";
import { definitions } from "../ceramic/config.json";
import { Loader } from "semantic-ui-react";
import { ProfileContainer } from "../components/styles/Profile.Style";
const index = require("../lib/e2ee.js");

export default function Profile({ ceramic, idx }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    async function getUserData() {
      try {
        if (idx) {
          const data = await idx.get(definitions.profile, idx.id);
          setUser(data);
          if(data){
            console.log("data fetched")
          }else{
            console.log("Something is wrong with IDX")
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
    getUserData();
  }, [idx]);

  return user ? (
    <>
      <ProfileContainer>
        <div className="profileContainer">
          <div className="profile">
            <img src="https://react.semantic-ui.com/images/avatar/large/patrick.png" alt="" />
            <h2>{user.name}</h2>
            <h3>
              <span className="addressSpan">{idx.id}</span>{" "}
            </h3>
            <h3>
              <span className="addressSpan">{user.userAddress}</span>{" "}
            </h3>
            <div className="profile-info">
              <div className="box">
                <UserOutlined style={{ marginRight: "4px" }} /> {user.notary ? "Notary" : "Party"}
              </div>
              <div className="box">
                <MailOutlined style={{ marginRight: "4px" }} />
                {user.email}
              </div>
              <div className="box">
                <FieldTimeOutlined style={{ marginRight: "4px" }} /> {user.joindate}
              </div>
            </div>
          </div>
        </div>
      </ProfileContainer>
    </>
  ) : (
    <Loader active size="medium">
      Fetching profile
    </Loader>
  );
}
