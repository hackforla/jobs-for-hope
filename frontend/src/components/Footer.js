import React from "react";

const Footer = () => (
  <footer className="footer">
    <div className="org-icon footer-content">
      <img
        id="org-icon"
        alt="logo"
        src="http://homeless.lacounty.gov/wp-content/uploads/2017/01/homeless_initiative_logo.png"
      />
    </div>
    <div className="quick-links-footer footer-content">
      <div className="quick-links-content">
        <h3>Quick Links</h3>
        <p className="link">
          <a href="/about">About Us</a>
        </p>
        <p className="link">
          <a href="/contact">Contact Us</a>
        </p>
        <p className="link">
          <a href="/organizations">Organizations</a>
        </p>
      </div>
    </div>
    <div className="social-media-footer footer-content">
      <h3>Follow Us</h3>
      <div className="social-media-btn-container">
        <div className="social-media-btn">
          <img
            id="social-media-btn"
            alt="twitter logo"
            src="http://www.stickpng.com/assets/images/580b57fcd9996e24bc43c53e.png"
          />
        </div>
        <div className="social-media-btn">
          <img
            id="social-media-btn"
            alt="instagram logo"
            src="http://www.transparentpng.com/download/logo-instagram/Sj4fEy-instagram-png-logo-high-quality.png"
          />
        </div>
      </div>
    </div>
    <div className="contact-footer footer-content">
      <h3>Contact Us</h3>
      <p id="contact-email"> homelessinitiative@lacounty.gov</p>
      <p id="contact-address"> 500 W. Temple Street, Room 493</p>
      <p id="contact-address"> Los Angeles, CA 90012</p>
    </div>
  </footer>
);

export default Footer
