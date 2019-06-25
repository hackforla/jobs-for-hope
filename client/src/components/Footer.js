import React from "react";
import "./Footer.scss";

const Footer = ({ activeUser, logOut }) => (
  <footer className="footer">
    {/* <div className="org-icon footer-content">
      <img
        id="org-icon"
        alt="logo"
        src="http://homeless.lacounty.gov/wp-content/uploads/2017/01/homeless_initiative_logo.png"
      />
    </div> */}
    <div className="quick-links-footer quick-links-content footer-content">
      <h3>Quick Links</h3>
      <p className="link">
        <a href="/organizations">Organizations</a>
      </p>
      <p className="link">
        <a href="/about">About Us</a>
      </p>
      <p className="link">
        <a href="/contact">Contact Us</a>
      </p>
      {activeUser.id ? (
        <p className="link" onClick={logOut}>
          Log Out
        </p>
      ) : (
        <React.Fragment>
          <p className="link">
            <a href="/register">Employer Sign Up</a>
          </p>
          <p className="link">
            <a href="/login">Employer Log In</a>
          </p>
        </React.Fragment>
      )}
    </div>
    <div className="org-icon footer-content">
      <img
        id="org-icon"
        alt="logo"
        src="http://homeless.lacounty.gov/wp-content/uploads/2017/01/homeless_initiative_logo.png"
      />
    </div>
    <div className="contact-footer footer-content">
      <h3>Contact Us</h3>
      <p id="contact-email"> homelessinitiative@lacounty.gov</p>
      <p id="contact-address"> 500 W. Temple Street, Room 493</p>
      <p id="contact-address"> Los Angeles, CA 90012</p>
    </div>
  </footer>
);

export default Footer;
