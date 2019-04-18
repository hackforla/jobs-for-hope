import React from "react";
import { NavLink } from "react-router-dom";
import logoImage from "../images/homelessinitiative.png";

const Navbar = ({ activeUser, logOut }) => {
  return (
    <nav className="navbar" id="myNavbar">
      <span>
        <img id="org-image" alt="logo" src={logoImage} />
      </span>
      <span className="nav-links">
        <ul>
          <li>
            <NavLink className="link" to="/" exact>
              Jobs
            </NavLink>
          </li>
          <li>
            <NavLink className="link" to="/organizations">
              Organizations
            </NavLink>
          </li>
          <li>
            <NavLink className="link" to="/about">
              About
            </NavLink>
          </li>
          <li>
            <NavLink className="link" to="/contact">
              Contact
            </NavLink>
          </li>
          { activeUser.id  ?
            <React.Fragment> 
             <li>
              <NavLink className="link" to="/account">
                Account
              </NavLink>
            </li>
            <li>
              <span className="link" onClick={logOut}>
                Log Out
              </span>
            </li>
            </React.Fragment>
              :
            <React.Fragment>   
            <li>
              <NavLink className="link" to="/register">
                Post A Job
              </NavLink>
            </li>
            <li>
              <NavLink className="link" to="/login">
                Log In
              </NavLink>
            </li>
            </React.Fragment> 
          }
        </ul>
      </span>
    </nav>
  );
}

export default Navbar;
