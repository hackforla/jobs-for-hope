import React from 'react';
import SearchBox from './SearchBox';
import JobPostings from './JobPostings';
import SideFilter from './SideFilter';

const Main = ({ filterByEmploymentType, calcDistance, userJobTitle, onSearchChange, onZipSearchChange, filteredJobs, onSetEmploymentTypeFT, onSetEmploymentTypePT, onSetDistance }) => (
  <div>
    <SearchBox
      onSearchChange={onSearchChange}
      onZipSearchChange={onZipSearchChange}
      userJobTitle={userJobTitle}
    />
    <div className="filters-postings-wrapper">
      <SideFilter
        onSetEmploymentTypeFT={onSetEmploymentTypeFT}
        onSetEmploymentTypePT={onSetEmploymentTypePT}
        onSetDistance={onSetDistance}
        calcDistance={calcDistance}
        filterByEmploymentType={filterByEmploymentType}
      />
      <section role="tablist" className="recent-postings-container">
        <h2 className="recent-postings-title"> Recent Job Postings</h2>
        <ul>
        {filteredJobs.map( (job, index) =>
          <li key={index}>
          <JobPostings
            job={job}
          />
          </li>
        )}
        </ul>
      </section>
    </div>
  </div>
);

export default Main;


  // Todo: <SearchByFilter />