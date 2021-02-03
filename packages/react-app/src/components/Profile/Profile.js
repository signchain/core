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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [userId, setUserId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    async function getUserData() {
      try {
        if (idx) {
          const data = await idx.get(definitions.profile, idx.id);
          setUser(data);
          setUserLoading(false);
          if (data) {
            console.log("data fetched");
          } else {
            console.log("Something is wrong with IDX");
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
        <EditProfile open={open} setOpen={setOpen} />
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
                            <Icon name="briefcase" />
                            Organistion
                          </Table.Cell>
                          <Table.Cell>Infosys</Table.Cell>
                        </Table.Row>

                        <Table.Row>
                          <Table.Cell>
                            <Icon name="time" />
                            Member Since
                          </Table.Cell>
                          <Table.Cell>{user.joindate}</Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table>
                    <Button primary onClick={() => setOpen(true)}>
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
