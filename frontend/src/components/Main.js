import React from 'react';
import SearchBox from './SearchBox';
import JobPostings from './JobPostings';
import SideFilter from './SideFilter';
import './Main.css';
import Modal from './Modal';

const Main = (props) => {
  return (
    <div>
      <SearchBox
      onSearchChange={props.onSearchChange}
      onZipSearchChange={props.onZipSearchChange}
      userJobTitle={props.userJobTitle}
      />
      <div className="filters-postings-wrapper">
        <SideFilter
        onSetEmploymentTypeFT={props.onSetEmploymentTypeFT}
        onSetEmploymentTypePT={props.onSetEmploymentTypePT}
        onSetDistance={props.onSetDistance}
        calcDistance={props.calcDistance}
        filterByEmploymentType={props.filterByEmploymentType}
        />
        <section role="tablist" className="recent-postings-container">
          <h2 className="recent-postings-title">Recent Job Postings</h2>
          <ul>
            {props.filteredJobs.map( (job, index) =>
              <li key={index}>
              <JobPostings
              job={job}
              />
              </li>
              )}
          </ul>
        </section>
      </div>
      <Modal />
    </div>
  )
}

export default Main;