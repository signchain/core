import styled from "styled-components";

export const DashboardContainer = styled.div`
  background-color: #edf2f7;
  height: 213.6px;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  align-items: center;
  /* margin: 70px 180px 70px 180px; */
  justify-content: center;

  overflow: hidden;
  background-color: #fff !important;
  .box-1 {
    width: 170px !important;

    box-sizing: border-box;
    border-radius: 3px;
    text-align: center;
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

  .helper-text {
    margin-top: 16px;
  }

  .btn-primary {
    background: rgb(76, 81, 191);
    color: #fff;
  }
`;
