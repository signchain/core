import styled from "styled-components";

export const SignInWarningContainer = styled.div`
  display: flex;
  flex-direction: column !important;
  justify-content: center !important;
  padding: 24px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.075);
  .lock-image {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .warning-text {
    text-align: center;
    justify-content: center;
  }

  .warning-btn {
    margin-top: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`;

// .warning-btn {
//   margin-top: 22px;
// }

// .SignIn-btn {
//   background-color: rgb(76 81 191);
//   color: #fff;
//   border-radius: 4px;
// }
