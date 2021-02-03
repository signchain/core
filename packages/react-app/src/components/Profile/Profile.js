// /* eslint-disable */
import React, { useEffect, useState } from "react";

import { definitions } from "../../ceramic/config.json";
import { Header, Icon, Loader, Segment, Card, Table, Button } from "semantic-ui-react";
import EditProfile from "./EditProfile";
import { ProfileContainer } from "../styles/Profile.Style";

export default function Profile({ ceramic, idx }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    async function getUserData() {
      try {
        if (idx) {
          const data = await idx.get(definitions.profile, idx.id);

          const userThreadDb = JSON.parse(localStorage.getItem('USER'))
          setUser(userThreadDb);
          setUserLoading(false);
          if(data){
            console.log("data fetched")
            console.log("Data:", data)
          }else{
            // Registration on idx
            console.log("Something is wrong with IDX")
            let notary = true
            if (userThreadDb.userType===0){
              notary = false
            }
            await idx.set(definitions.profile, {
              name: userThreadDb.name,
              email: userThreadDb.email,
              notary: notary,
              userAddress: userThreadDb.address
            });
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
    getUserData();
  }, [idx]);

  return !userLoading ? (
    user ? (
      <>
        <EditProfile open={open} setOpen={setOpen} user={user} idx={idx}/>
        <ProfileContainer>
          <div className="profileContainer">
            <div className="profile">
              <img src="https://react.semantic-ui.com/images/avatar/large/patrick.png" alt="" />
              <h2>{user.name}</h2>
              <h3>
                <span className="addressSpan">{idx.id}</span>{" "}
              </h3>
              <h3>
                <span className="addressSpan">{user.address}</span>{" "}
              </h3>

              <div className="meta-info">
                <div className="about">
                  <Card className="about-card">
                    <Card.Content header="About" />
                    <Card.Content description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s," />

                    <Table fixed>
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell>
                            <Icon name="user" />
                            Type
                          </Table.Cell>
                          <Table.Cell>{user.notary ? "Notary" : "Party"}</Table.Cell>
                        </Table.Row>

                        <Table.Row>
                          <Table.Cell>
                            {" "}
                            <Icon name="mail" />
                            Email
                          </Table.Cell>
                          <Table.Cell> {user.email}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>
                            {" "}
                            <Icon name="phone" />
                            Phone
                          </Table.Cell>
                          <Table.Cell> {user.profileDetails.phoneNumber}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>
                            {" "}
                            <Icon name="calendar alternate outline" />
                            DOB
                          </Table.Cell>
                          <Table.Cell> {user.profileDetails.DOB}</Table.Cell>
                        </Table.Row>

                        {/*<Table.Row>
                          <Table.Cell>
                            <Icon name="time" />
                            Member Since
                          </Table.Cell>
                          <Table.Cell>{user.joindate}</Table.Cell>
                        </Table.Row>*/}
                      </Table.Body>
                    </Table>
                    <Button
                      primary
                      onClick={() => setOpen(true)}
                      className="form-input-btn"
                      style={{ backgroundColor: "#4c51bf" }}
                    >
                      Update Profile
                    </Button>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </ProfileContainer>
      </>
    ) : (
      <Segment placeholder>
        <Header icon>
          <Icon name="search" color="violet" />
          No profile found :(.
        </Header>
        <Segment.Inline>There was an issue fetching the user profile.</Segment.Inline>
      </Segment>
    )
  ) : (
    <Loader active size="medium">
      Fetching profile
    </Loader>
  );
}
