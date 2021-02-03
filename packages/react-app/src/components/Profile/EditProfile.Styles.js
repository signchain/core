import styled from "styled-components";

export const FormContainer = styled.div`
  overflow: hidden;
  width: 392px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  .logo-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;
  }
  .form-input {
    margin: 12px 0 12px 0;
    width: 392px;
    height: 37.8px !important;
    width: 100%;
  }
  .checkbox {
    color: #717171;
    margin-top: 14px;
    margin-bottom: 2px;
  }
  /* .btn-primary {
    width: 374px !important;
    height: 38px !important;
    background-color: #4c51bf;
    color: #fff;
    margin-right: 1px;
  } */

  .form-input-btn {
    width: 385px;
    color: #fff;
    background-color: #4c51bf;
  }
`;
