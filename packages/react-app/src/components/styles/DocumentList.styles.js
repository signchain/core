import styled from "styled-components";

export const DocumentContainer = styled.div`
  background-color: #fff;
  /* margin: 60px; */
  width: 100%;
  height: 86vh;
`;

export const DocumentHeader = styled.div`
  background: linear-gradient(89.72deg, #4c51bf 0.19%, #3a3ab0 28.58%, #4c51bf 99.07%);

  align-items: center;
`;

export const HeaderContainer = styled.div`
  .header-container {
    display: flex;
    background-color: #4143b6;
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
    border-radius: 4px;
    border: 1px solid rgba(209, 209, 209, 0.5);

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

  .docs-icon {
    margin-bottom: 6px;
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
  h3 {
    display: inline;
    color: #4c51bf !important;
    margin-right: 8px;
  }
  display: flex;
  align-items: center;
  img {
    margin-right: 8px;
  }
`;

export const Actions = styled.div`
  display: flex;
  margin-top: 22px;
  justify-content: space-between;
`;

export const MetaInfo = styled.div`
  display: flex;
  margin-top: 22px;
  justify-content: space-between;
`;
