import React from 'react';
import './Contact.scss';

const Contact = () => (
  <main>
    <div className="contact-banner" role="banner">
      <p className="contact-title"> Getting In Touch</p>
    </div>
    <div className="contact-content-container">
        <div className="contact-form-container">
            <h2 id="contact-title">Contact Us</h2>
            <form method="POST" name="contact-form" aria-labelledby="contact">
                <label htmlFor="name">Full Name</label><br />
                <input id="name" name="name" className="contact-input" /><br />

                <label htmlFor="email">Email</label><br />
                <input id="email" name="email" className="contact-input" /><br />

                <label htmlFor="phone">Phone</label><br />
                <input id="phone" name="phone" className="contact-input" /><br />
                <label htmlFor="message">Message</label><br />
                <textarea id="message" name="message" className="contact-input" form="contact-form"></textarea>

                <input id="send-btn" type="submit" value="Send" />
            </form>
        </div>
        <div className="department-information-container" role="contentinfo">
            <h2 id="department-title">
                Office of Homeless Initiative
            </h2>
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
            <img id="county-img" alt="LA County Seal" src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Seal_of_Los_Angeles_County%2C_California.svg/215px-Seal_of_Los_Angeles_County%2C_California.svg.png" />
        </div>
    </div>
  </main>
);

export default Contact;

//TODO: Put form action later