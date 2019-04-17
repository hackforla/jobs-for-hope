import React from "react";
import "./Contact.scss";
import Banner from "./Banner";
const countyLogo = require("../images/Seal_of_Los_Angeles_County.png");

const Contact = () => (
  <main>
    <Banner
      titleUpper="Getting"
      titleLower={"In Touch"}
      imageName="homeless_poster_lores"
    />

    <div className="contact-content-container">
      <div className="contact-form-container">
        <h2 id="contact-title">Contact Us</h2>
        <form method="POST" name="contact-form" aria-labelledby="contact">
          <label htmlFor="name">Full Name</label>
          <br />
          <input id="name" name="name" className="contact-input" />
          <br />

          <label htmlFor="email">Email</label>
          <br />
          <input id="email" name="email" className="contact-input" />
          <br />

          <label htmlFor="phone">Phone</label>
          <br />
          <input id="phone" name="phone" className="contact-input" />
          <br />
          <label htmlFor="message">Message</label>
          <br />
          <textarea
            id="message"
            name="message"
            className="contact-input"
            form="contact-form"
          />

          <input id="send-btn" type="submit" value="Send" />
        </form>
      </div>
      <div className="department-information-container" role="contentinfo">
        <h2 id="department-title">Office of Homeless Initiative</h2>
        <p className="department-info" id="deparment-director">
          Phil Ansell, Director
        </p>
        <p className="department-info" id="deparment-location">
          Kenneth Hahn Hall of Administration
        </p>
        <p className="department-info" id="department-address">
          500 W. Temple Street, Room 493 <br />
          Los Angeles, CA 90012
        </p>
        <p className="department-info">
          <a id="web-link" href="homelessinitiative@lacounty.gov">
            homelessinitiative@lacounty.gov
          </a>
        </p>
        <img id="county-img" alt="LA County Seal" src={countyLogo} />
      </div>
    </div>
  </main>
);

export default Contact;

// TODO: Put form action later
