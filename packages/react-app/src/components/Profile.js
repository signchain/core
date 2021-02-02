// /* eslint-disable */
import React, {useEffect, useState} from "react";
import {FieldTimeOutlined, MailOutlined, UserOutlined} from "@ant-design/icons";
import {definitions} from "../ceramic/config.json";
import {Header, Icon, Loader, Segment} from "semantic-ui-react";
import {ProfileContainer} from "./styles/Profile.Style";

export default function Profile({ ceramic, idx }) {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  useEffect(() => {
    async function getUserData() {
      try {
        if (idx) {
          const data = await idx.get(definitions.profile, idx.id);
          setUser(data);
          setUserLoading(false);
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

  return !userLoading ? (
    user ?
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
