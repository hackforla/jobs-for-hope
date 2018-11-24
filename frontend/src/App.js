import React, { Component } from 'react';
import {
  Route, BrowserRouter as Router
} from 'react-router-dom';
import { connect } from 'react-redux';
import { dist } from './utils/utils';

import Navbar from './components/Navbar';
import Main from './components/Main';
import Organizations from './components/Organizations';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';

import {
  setSearchField,
  setSearchZip,
  fetchJobs,
  fetchOrganizations,
  setEmploymentTypeFT,
  setEmploymentTypePT,
  setDistance,
  // setDistance25,
  // setDistanceOver50,
} from './store/actions';

import './App.scss';


const mapStateToProps = state => ({
  searchField: state.searchJobListing.searchField,
  zipcode: state.searchJobListing.zipcode,

  isPending: state.requestJobs.isPending,
  jobData: state.requestJobs.jobData,
  isError: state.requestJobs.isError,

  orgsArePending: state.requestOrgs.orgsArePending,
  organizationData: state.requestOrgs.organizationData,
  orgsGetDataError: state.requestOrgs.orgsGetDataError,

  employmentTypeFT: state.changeEmploymentType.FT,
  employmentTypePT: state.changeEmploymentType.PT,

  distance: state.changeDistance.distance
})

const mapDispatchToProps = dispatch => ({
  onSearchChange: (event) => dispatch(setSearchField(event.target.value)),
  onZipSearchChange: (event) => dispatch(setSearchZip(event.target.value)),

  onfetchJobs: () => dispatch(fetchJobs()),
  onfetchOrgs: () => dispatch(fetchOrganizations()),

  onSetEmploymentTypeFT: (event) => dispatch(setEmploymentTypeFT(event.target.checked)),
  onSetEmploymentTypePT: (event) => dispatch(setEmploymentTypePT(event.target.checked)),

  onSetDistance: (event) => dispatch(setDistance(event.target.value))
  // onSetDistance25:
  // onSetDistanceOver50:
})


class App extends Component {

componentDidMount() {
  this.props.onfetchJobs();
  this.props.onfetchOrgs();
}

//searchField is for matching search to job listing
  render() {
    const { searchField, zipcode, jobData, isPending, organizationData, employmentTypeFT, employmentTypePT, distance } = this.props;

    // console.log(jobData);
    // console.log(organizationData);

    let filteredJobs;

    filteredJobs = jobData
    .filter(job => job.gsx$zipcode.$t.includes(zipcode))
    .filter(job => job.title.$t.toLowerCase().includes(searchField.toLowerCase()))

    if (employmentTypeFT === true && employmentTypePT === true) {
      filteredJobs = filteredJobs;
    } else if (employmentTypeFT === true) {
      filteredJobs = filteredJobs.filter(job => job.gsx$duration.$t === 'Full-time')
    } else if (employmentTypePT ===true) {
      filteredJobs = filteredJobs.filter(job => job.gsx$duration.$t.includes('Part-time'))
    }

//this needs jobData again
    if(distance === "10") {
      //zipcode calc distance of each job posting: gsx$zipcode.$t
      jobData
        .map(job => {
         job.distance = dist(zipcode, job.gsx$zipcode.$t);
         return job;
        })

        filteredJobs = jobData
        .filter(jobs => jobs.distance <= 10);

      console.log(filteredJobs);
    } else if (distance === "25") {
      //zipcode calc distance of each job posting: gsx$zipcode.$t
      jobData
        .map(job => {
         job.distance = dist(zipcode, job.gsx$zipcode.$t);
         return job;
        })

        filteredJobs = jobData
        .filter(jobs => jobs.distance <= 25);

        console.log(filteredJobs);
    } else if (distance === "1000") {
      //zipcode calc distance of each job posting: gsx$zipcode.$t
      jobData
        .map(job => {
         job.distance = dist(zipcode, job.gsx$zipcode.$t);
         return job;
        })

        filteredJobs = jobData
        .filter(jobs => jobs.distance <= 1000);

        console.log(filteredJobs);
    }

    return isPending ?
      <h1>Loading...</h1> :
      (
      <Router>
        <div className="App">
          <header className="header">
            <Navbar />
          </header>
          <Route exact path='/' render={() =>
            (<Main
              {...this.props}
              filteredJobs={filteredJobs}
            />
          )}
          />
          <Route path='/organizations' render={() =>
            (<Organizations
              organizationData={organizationData}
            />
          )}
          />
          <Route path='/about' component={About} />
          <Route path='/contact' component={Contact} />
          <Footer />
        </div>
      </Router>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
