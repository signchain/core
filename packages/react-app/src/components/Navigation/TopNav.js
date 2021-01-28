import React from "react";
import logo from "../../images/logo.png";
import Account from "../Account";
import { Nav, Bars, NavLink, NavMenu, NavBtn, NavBtnLink } from "../styles/Navigation.Styles";

function TopNav({
  address,
  userProvider,
  localProvider,
  mainnetProvider,
  price,
  minimized,
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  blockExplorer,
}) {
  return (
    <>
      <Nav>
        <NavLink to="/home">
          <img src={logo} alt="logo" />
        </NavLink>
        <Bars />
        <NavMenu>
          <NavLink to="/home" activeStyle>
            Home
          </NavLink>
          <NavLink to="/documents" activeStyle>
            Documents
          </NavLink>
          <NavLink to="/profile" activeStyle>
            Profile
          </NavLink>

          {/* Second Nav */}
        </NavMenu>
      </Nav>
    </>
  );
}

export default TopNav;
