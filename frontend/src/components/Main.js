import React from 'react';
import SearchBox from './SearchBox';
import JobPostings from './JobPostings';

const Main = ({ onSearchChange, jobData }) => (
  <div>
    <SearchBox
      onSearchChange={onSearchChange}
    />
    <section role="tablist" className="recent-postings-container">
      <h2 className="recent-postings-title"> Recent Job Postings</h2>
      <ul>
      {jobData.map( (job, index) =>
        <li key={index}>
        <JobPostings
          job={job}
        />
        </li>
      )}
      </ul>
  </section>
  </div>
);

export default Main;


  // Todo: <SearchByFilter />