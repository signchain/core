import styled from "styled-components";

export const FormContainer = styled.div`
  overflow: hidden;
  width: 392px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .logo-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;
  }
  .form-input {
    margin: 12px 0 12px 0;
    width: 392px;
    width: 100%;
  }
  .checkbox {
    color: #717171;
  }
  .btn-primary {
    width: 374px !important;
    height: 38px !important;
    background-color: #4c51bf;
    color: #fff;
    margin-right: 1px;
  }
`;
