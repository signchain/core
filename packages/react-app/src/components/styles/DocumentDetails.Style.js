import styled from "styled-components";

export const DocumentContainer = styled.div`
  background-color: #fff;
  /* margin: 60px; */
  width: 100%;
`;

export const DocumentHeader = styled.div`
  background: -webkit-linear-gradient(45deg, #754dcb, #4d94ff);
  background: -o-linear-gradient(45deg, #754dcb, #4d94ff);
  background: linear-gradient(45deg, #754dcb, #4d94ff);

  align-items: center;
`;

export const HeaderContainer = styled.div`
  justify-content: space-between;
  display: flex;
  align-items: flex-start;
  margin-left: 50px;
  margin-right: 50px;
  padding: 60px 60px 100px 60px;
  color: #fff;
  /* padding: 30px; */
  text-align: left;
  .docs-status-pending {
    background: rgba(255, 255, 255, 0.3);
    padding: 11px 14px;
    border-radius: 4px;
  }
  .document-title-section {
    width: 720px;
  }
  .docs-status-success {
    background: rgba(72, 187, 120, 0.7);
    padding: 11px 14px;
    border-radius: 4px;
  }
  .description {
    font-size: 14px;
    width: 720px;
    font-style: normal;
    font-weight: normal;
    text-align: left;
  }
`;

export const TitleHeading = styled.h1`
  font-weight: 600;
  font-size: 25px;
  color: #fff;
  text-align: left;
  width: 720px;
`;

export const DocumentTable = styled.div`
  background-color: #fff;
  margin: 10px 60px 100px 60px;
  padding: 22px 30px 100px 60px;
  height: 60vh;
  .name-content {
    display: flex;
    margin-bottom: 48px;
  }
  .img-container {
    height: 50px;
    width: 50px;
    border-radius: 50%;
  }

  .img-container {
    height: 50px;
    width: 50px;
    border-radius: 50%;
  }

  .card__h1 {
    text-transform: uppercase;
  }
  p {
    justify-content: center;
    text-align: center;
  }

  .shared-info {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 4px !important;
  }
  .sign-btn {
    margin-top: 26px;
    display: flex;
    justify-content: flex-end !important;
  }
  .table-header {
    color: #718096 !important;
  }
`;

export const WarningNote = styled.div`
  display: flex;
  height: 50px;
  background: rgba(229, 62, 62, 0.3);
  color: #718096;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  align-items: center;
  justify-content: center;
`;

export const Success = styled.div`
  display: flex;
  height: 50px;
  background: rgba(72, 187, 120, 0.3);
  color: #718096;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  align-items: center;
  justify-content: center;
`;
