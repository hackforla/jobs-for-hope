import React from 'react';
import './JobPostings.scss';

const JobPostings = ({job}) => (
  <div className="posting-card">
    <div className="posting-content">
      <div className="left-posting">
        <h3>{job.title.$t}</h3>
        <div className="posting-location-duration">
          <p> Los Angeles, 90041 | Full- Time</p>
          <p> Posted Today</p>
        </div>
      </div>
      <div className="middle-posting">
        <h4>{job.gsx$employername.$t}</h4>
        <p>{job.gsx$responsibilities.$t}</p>
      </div>
      <div className="right-posting">
        <button id="view-more-btn" type="button">View more</button>
      </div>
    </div>
  </div>
);

export default JobPostings;
