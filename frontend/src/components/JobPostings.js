import React from 'react';
import './JobPostings.scss';

const JobPostings = ({job}) => (
  <div className="posting-card">
    <div className="posting-content">
      <div className="left-posting">
        <h3>{job.title}</h3>
        <div className="posting-location-duration">
          <p> {job.zipcode} | {job.hours}</p>
        </div>
      </div>
      <div className="middle-posting">
        <h4>{job.org}</h4>
        <p>{job.info_link}</p>
      </div>
      <div className="right-posting">
        <button id="view-more-btn" type="button">View more</button>
      </div>
    </div>
  </div>
);

export default JobPostings;
