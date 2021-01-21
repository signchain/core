import styled from "styled-components";

export const DocsContainer = styled.div`
  background-color: #fff;

  width: 100%;
  display: flex;
  justify-content: center;
  .container {
    width: 800px;
    padding: 50px 120px 10px 120px;
  }
`;

export const InputGroup = styled.div`
  margin-bottom: 12px;
  .input-group {
    font-weight: 700;
    margin-top: 6px;
    font-size: 13px;
  }

  .submit-btn {
    background-color: #4c51bf !important;
    color: #fff;
  }
`;

export const Title = styled.h2`
  font-size: 24px;
  color: #717171;
  margin-bottom: 25px;
  text-align: center;
`;
