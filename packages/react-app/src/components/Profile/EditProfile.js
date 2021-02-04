import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Message, Modal } from "semantic-ui-react";

import { FormContainer } from "./EditProfile.Styles";
import { updateUserProfile } from "../../lib/threadDb";
import Warning from "./Warning";
import updateSuccess from "./updateSuccess";

function EditProfile({ open, setOpen, user, idx }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const [dob, setDob] = useState(user.profileDetails.DOB);
  const [userId, setUserId] = useState(user._id);
  const [phoneNumber, setPhoneNumber] = useState(user.profileDetails.phoneNumber);
  const [loader, setloader] = useState(false);
  const [warning, setWarning] = useState(false);
  const [success, setSuccess] = useState(false);

  const updateProfile = async () => {
    console.log("Function called!!!");
    setloader(true);

    if (name.length === 0) {
      setName("NA");
    }

    if (phoneNumber.length !== 0 && phoneNumber !== "NA") {
      const pattern = /^\d{10}$/;
      if (!phoneNumber.match(pattern)) {
        // setWarning(true);
        alert("Wrong mobile number!!");
      }
    } else {
      setPhoneNumber("NA");
    }

    if (email.length !== 0 && email !== "NA") {
      const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
      if (!email.match(pattern)) {
        alert("Wrong email!!");
        // setWarning(true);
      }
    } else {
      setEmail("NA");
    }

    const result = await updateUserProfile(name, email, dob, phoneNumber, userId, idx, user.publicKey);
    if (result) {
      alert("Updated!!");
      setloader(false);
      setOpen(false);
    } else {
      alert("Something went wrong!!!");
    }

    //
  };

  return (
    <>
      <Warning warning={warning} setWarning={setWarning} />
      <updateSuccess success={success} setSuccess={setSuccess} />
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
                    value={name}
                    type="text"
                    className="form-input"
                    onChange={e => setName(e.target.value)}
                  />
                </Form.Field>

                <Form.Field className="form-input">
                  <Input
                    fluid
                    type="text"
                    icon="mail"
                    size="30"
                    iconPosition="left"
                    value={email}
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
                    value={phoneNumber}
                    className="form-input"
                    onChange={e => setPhoneNumber(e.target.value)}
                  />
                </Form.Field>

                <Form.Field className="form-input">
                  <Input
                    fluid
                    type="datetime-local"
                    icon="time"
                    iconPosition="left"
                    value={dob}
                    className="form-input"
                    onChange={e => setDob(e.target.value)}
                  />
                </Form.Field>

                <Button type="primary" loading={loader} className="form-input-btn" onClick={updateProfile}>
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
