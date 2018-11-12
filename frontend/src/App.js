import React, { Component } from 'react';
import {
  Route, BrowserRouter as Router
} from 'react-router-dom';
import { connect } from 'react-redux';

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
  setEmploymentTypePT
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
})

const mapDispatchToProps = dispatch => ({
    onSearchChange: (event) => dispatch(setSearchField(event.target.value)),
    onZipSearchChange: (event) => dispatch(setSearchZip(event.target.value)),
    onfetchJobs: () => dispatch(fetchJobs()),
    onfetchOrgs: () => dispatch(fetchOrganizations()),
    onSetEmploymentTypeFT: (event) => dispatch(setEmploymentTypeFT(event.target.checked)),
    onSetEmploymentTypePT: (event) => dispatch(setEmploymentTypePT(event.target.checked))
})


class App extends Component {

componentDidMount() {
  this.props.onfetchJobs();
  this.props.onfetchOrgs();
}

//searchField is for matching search to job listing
  render() {
    const { searchField, zipcode, jobData, isPending, organizationData, employmentTypeFT, employmentTypePT } = this.props;

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

    console.log(filteredJobs);

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
              // filterSearch={filterSearch}
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


