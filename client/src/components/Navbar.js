import React from "react";
import "./Navbar.scss";
import { NavLink } from "react-router-dom";
import logoImage from "../images/homelessinitiative.png";

const Navbar = ({ activeUser, logOut, toggle, toggler }) => {
  return (
    <nav className="navbar" id="myNavbar">
      <div className="image-span">
        <a href="/">
          <img id="org-image" alt="logo" src={logoImage} />
        </a>
        <div className="burger-container">
          <div className="burger" onClick={toggler}>
            <div className={`burger-layer ${toggle ? "burger-top" : null}`} />
            <div className={`burger-layer ${toggle ? "burger-mid" : null}`} />
            <div
              className={`burger-layer ${toggle ? "burger-bottom" : null}`}
            />
          </div>
        </div>
      </div>

      <span className={`nav-links ${toggle ? "show" : "hide"}`}>
        <ul onClick={toggler}>
          <li>
            <NavLink className="link jobs-link" to="/" exact>
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
          {activeUser.id ? (
            <React.Fragment>
              <li>
                <NavLink className="link" to="/account">
                  Account
                </NavLink>
              </li>
              <li className="mobile-li link" onClick={logOut}>
                <p className="link">Log Out</p>
              </li>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <li>
                <NavLink className="mobile-li link" to="/register">
                  Register
                </NavLink>
              </li>
              <li>
                <NavLink className="mobile-li link" to="/login">
                  Log In
                </NavLink>
              </li>
            </React.Fragment>
          )}
        </ul>
      </span>
    </nav>
  );
};

export default Navbar;
