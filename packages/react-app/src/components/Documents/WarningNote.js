import React from "react";
import {Success, WarningNote} from "../styles/DocumentDetails.Style";

export function WarningStatus() {
  return (
    <WarningNote>
      <p>Please Download the Attachment and read it before signing.</p>
    </WarningNote>
  );
}

export function SignSuccess() {
  return (
    <Success>
      <p> You have already signed this Document </p>
    </Success>
  );
}
