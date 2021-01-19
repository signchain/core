import React from "react";
import logo from "../../images/logo.png";

import { Nav, Bars, NavLink, NavMenu, NavBtn, NavBtnLink } from "../styles/Navigation.Styles";

function TopNav() {
  return (
    <>
      <Nav>
        <NavLink to="/home">
          <img src={logo} alt="logo" />
        </NavLink>
        <Bars />
        <NavMenu>
          <NavLink to="/dashboard" activeStyle>
            Home
          </NavLink>
          <NavLink to="/documents" activeStyle>
            My Documents
          </NavLink>
          <NavLink to="/profile" activeStyle>
            Profile
          </NavLink>

          {/* Second Nav */}
          {/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
        </NavMenu>
        <NavBtn>
          <NavBtnLink to="/signin">Connect</NavBtnLink>
        </NavBtn>
      </Nav>
    </>
  );
}

export default TopNav;
