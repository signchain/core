import styled from "styled-components";

export const DocumentContainer = styled.div`
  background-color: #fff;
  /* margin: 60px; */
  width: 100%;
  height: 86vh;
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
  grid-template-rows: 100vh;
  align-items: center;
  justify-items: center;
`;

export const DetailsContainer = styled.div`
  /* display: grid;
  grid-template-columns: repeat(2, 1fr); */
  display: flex;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;

  .created-by {
    margin: 0;
    color: #717171;
  }

  .Details-card {
    background-color: #fff;
    border-radius: 10px;
    border: 1px solid rgba(209, 209, 209, 0.5);
    display: flex;
    max-width: 100%;
    margin: 20px;
    overflow: hidden;
    width: 700px;
    height: auto;
    &:hover {
      background: linear-gradient(0deg, #feffff, #feffff);
      border: 1px solid #4d4cbb;
      box-sizing: border-box;
      box-shadow: 0px 9px 10px rgba(101, 148, 170, 0.1);
    }
  }

  .Details-card-preview {
    background-color: #4c51bf;
    color: #fff;
    padding: 30px;
    max-width: 250px;
  }
  .meta-text {
    color: #717171;
    /* margin-top: 4px; */
  }
  .course-preview a {
    color: #fff;
    display: inline-block;
    font-size: 12px;
    opacity: 0.6;
    margin-top: 30px;
    text-decoration: none;
  }

  .heading {
    font-size: 12px;
    color: #717171;
    margin-top: 2px;
  }

  .Details-card-info {
    padding: 30px;
    position: relative;
    width: 100%;
  }

  .progress-container {
    position: absolute;
    top: 30px;
    right: 30px;
    text-align: left;
    width: 150px;
  }

  .progress {
    background-color: #ddd;
    border-radius: 3px;
    height: 5px;
    width: 100%;
  }

  .progress::after {
    border-radius: 3px;
    background-color: #2a265f;
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 5px;
    width: 66%;
  }

  .progress-text {
    font-size: 12px;

    letter-spacing: 1px;
  }

  .read-more {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
  }

  .docs-icon {
    margin-bottom: 1px;
  }
  .btn {
    background-color: #4c51bf;
    border: 0;
    border-radius: 5px;

    color: #fff;
    font-size: 16px;
    padding: 12px 25px;
    position: absolute;
    bottom: 30px;
    right: 30px;
    letter-spacing: 1px;
  }

  @media screen and (max-width: 480px) {
    .social-panel-container.visible {
      transform: translateX(0px);
    }

    .floating-btn {
      right: 10px;
    }
  }
`;

export const DetailsCard = styled.div`
  background-color: #fff;
  padding-left: 72px;
  padding-right: 72px;

  align-items: center;
  justify-items: center;

  .docs-heading {
    color: #717171;
    margin: 0 0 18px 0;
    padding-top: 8px;
    text-align: center;
  }
`;

export const DocsTitle = styled.div`
  margin-top: 16px;
`;
