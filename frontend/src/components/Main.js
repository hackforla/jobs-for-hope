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
      onSearchChange={this.props.onSearchChange}
      onZipSearchChange={this.props.onZipSearchChange}
      userJobTitle={this.props.userJobTitle}
      />
      <div className="filters-postings-wrapper">
        <SideFilter
        onSetEmploymentTypeFT={this.props.onSetEmploymentTypeFT}
        onSetEmploymentTypePT={this.props.onSetEmploymentTypePT}
        onSetDistance={this.props.onSetDistance}
        calcDistance={this.props.calcDistance}
        filterByEmploymentType={this.props.filterByEmploymentType}
        />
        <section role="tablist" className="recent-postings-container">
          <h2 className="recent-postings-title">Recent Job Postings</h2>
          <ul>
            {this.props.filteredJobs.map( (job, index) =>
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