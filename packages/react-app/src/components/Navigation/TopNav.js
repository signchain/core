import React from "react";
import logo from "../../images/logo.png";
import Account from "../Account"
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
        {/* <div style={{position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10, zIndex: 1000}}>
          <Account
              address={address}
              localProvider={userProvider}
              userProvider={userProvider}
              mainnetProvider={mainnetProvider}
              price={price}
              web3Modal={web3Modal}
              loadWeb3Modal={loadWeb3Modal}
              logoutOfWeb3Modal={logoutOfWeb3Modal}
              blockExplorer={blockExplorer}
          />
        </div> */}
      </Nav>
    </>
  );
}

export default TopNav;
