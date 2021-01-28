import styled from "styled-components";

export const DashboardContainer = styled.div`
  background-color: #edf2f7;
  height: 90vh;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  align-items: center;
  /* margin: 70px 180px 70px 180px; */
  justify-content: center;

  overflow: hidden;
  background-color: #fff !important;
  .box-1 {
    width: 170px;
    height: 200px;
    border: 1px solid rgba(209, 209, 209, 0.5);
    box-sizing: border-box;
    border-radius: 3px;
    text-align: center;
    justify-content: center;
    &:hover {
      box-shadow: 1px 9px 10px rgba(101, 148, 170, 0.1);
      background: linear-gradient(0deg, #feffff, #feffff);
      border: 1px solid #4d4cbb;
    }
  }

  .box-2 {
    width: 170px;
    height: 200px;
    border: 1px solid rgba(209, 209, 209, 0.5);
    box-sizing: border-box;
    border-radius: 3px;
    text-align: center;
    margin: inherit !important;
    justify-content: center;
  }

  .select-actions {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 22px !important;
    width: 564px;
    align-items: center;
    justify-items: center;
  }

  .icon {
    margin-top: 45px;
    margin-bottom: 18px;
  }
  p {
    font-weight: normal;
    font-size: 16px;
    line-height: 19px;
    /* identical to box height, or 119% */
    color: #717171;
    text-align: center;
  }
  .welcome-heading {
    font-style: normal;
    font-weight: normal;
    font-size: 32px;
    line-height: 52px;
    /* identical to box height, or 141% */
    text-align: center;
    color: #717171;
    margin-bottom: 42px;
  }
`;
