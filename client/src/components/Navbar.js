import React from "react";
import { NavLink } from "react-router-dom";
import logoImage from "../images/homelessinitiative.png";

const Navbar = () => (
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
        <li>
          <NavLink className="link post-job-link" to="/register">
            Post A Job
          </NavLink>
        </li>
        <li>
          <NavLink className="link log-in-link" to="/login">
            Log In
          </NavLink>
        </li>
      </ul>
    </span>
  </nav>
);

export default Navbar;
