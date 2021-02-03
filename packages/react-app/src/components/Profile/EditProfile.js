import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Message, Modal } from "semantic-ui-react";

import { FormContainer } from "./EditProfile.Styles";
import {updateUserProfile} from "../../lib/threadDb";

function EditProfile({ open, setOpen, user, idx }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const [dob, setDob] = useState(user.profileDetails.DOB);
  const [userId, setUserId] = useState(user._id);
  const [phoneNumber, setPhoneNumber] = useState(user.profileDetails.phoneNumber);

  const updateProfile = async ()=>{
    console.log("Function called!!!")
    await updateUserProfile(name, email, dob, phoneNumber, userId, idx, user.publicKey)
  }

  return (
    <>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        size="small"
        style={{ width: "450px" }}
      >
        <Modal.Header>Profile Update</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <FormContainer>
              <Form>
                <Form.Field className="form-input" required>
                  <Input
                    fluid
                    icon="user"
                    iconPosition="left"
                    placeholder="Enter your Full Name"
                    type="text"
                    className="form-input"
                    onChange={e => setName(e.target.value)}
                  />
                </Form.Field>

                <Form.Field className="form-input">
                  <Input
                    fluid
                    type="email"
                    icon="mail"
                    size="30"
                    iconPosition="left"
                    placeholder="JohnDoe@domain.com"
                    className="form-input"
                    onChange={e => setEmail(e.target.value)}
                  />
                </Form.Field>

                <Form.Field className="form-input">
                  <Input
                    fluid
                    type="tel"
                    icon="phone"
                    iconPosition="left"
                    placeholder="Enter your Mobile number"
                    className="form-input"
                    pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                    onChange={e => setPhoneNumber(e.target.value)}
                  />
                </Form.Field>

                <Form.Field className="form-input">
                  <Input
                    fluid
                    type="datetime-local"
                    icon="time"
                    iconPosition="left"
                    placeholder="Enter your DOB"
                    className="form-input"
                    pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                    onChange={e => setDob(e.target.value)}
                  />
                </Form.Field>

                <Button type="primary" className="form-input-btn" onClick={updateProfile}>
                  Update
                </Button>
              </Form>
            </FormContainer>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    </>
  );
}

export default EditProfile;
