import styled from "styled-components";

export const ProfileContainer = styled.div`
  align-items: center;
  justify-content: center;
  background-color: #f0f2f5;
  width: 100%;
  /* height: 80vh; */
  border-radius: 4px;
  .profile {
    align-items: center;
    text-align: center;
  }
  .form-input-btn {
    width: 385px;
    color: #fff;
    background-color: #4c51bf;
  }
  .profileContainer img {
    border-radius: 50%;
    width: 140px;
    height: auto;
    justify-content: center;
  }

  .addressSpan {
    background-color: rgb(91, 41, 199, 0.2);
    padding: 10px 10px 10px 10px;
    border-radius: 5px !important;
    overflow: hidden;
  }

  h3 {
    overflow: hidden;
    padding: 10px;
  }

  .profile-info {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    margin-top: 40px;
  }
  .meta-info {
    display: flex;
    margin: auto;
    justify-content: center;
  }
  .ui.card > .content {
    text-align: inherit;
  }
  .about-card {
    width: 700px;
    margin-right: 18px;
    overflow: hidden;
  }
`;
