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
})


class App extends Component {
  state = {
    filteredJobs: []
  }

  componentDidMount() {
    this.props.onfetchJobs();
    this.props.onfetchOrgs();
  }

  userJobTitle = () => {
    let populateFilteredJobs = this.props.jobData
    .filter(job => job.gsx$zipcode.$t.includes(this.props.zipcode))
    .filter(job => job.title.$t.toLowerCase().includes(this.props.searchField.toLowerCase()))

    this.setState({
      filteredJobs: populateFilteredJobs
    })
  }

  calcDistance = () => {

    const { zipcode, jobData, distance } = this.props;
    let populateFilteredJobs = jobData;

    //this needs jobData again
    if(distance === "10") {
      //if jobTitle...gotta filter by job title first!
      //use zipcodes to calculate distance of each job posting: gsx$zipcode.$t
      populateFilteredJobs = populateFilteredJobs
        .map(job => {
         job.distance = dist(zipcode, job.gsx$zipcode.$t);
         return job;
        })
        .filter(jobs => jobs.distance <= 10)
        .filter(job => job.title.$t.toLowerCase().includes(this.props.searchField.toLowerCase()));

      this.setState({
        filteredJobs: populateFilteredJobs
      })

    } else if (distance === "25") {
     populateFilteredJobs = populateFilteredJobs
        .map(job => {
         job.distance = dist(zipcode, job.gsx$zipcode.$t);
         return job;
        })
        .filter(jobs => jobs.distance <= 25)
        .filter(job => job.title.$t.toLowerCase().includes(this.props.searchField.toLowerCase()));

      this.setState({
        filteredJobs: populateFilteredJobs
      })
    } else if (distance === "1000") {
     populateFilteredJobs = populateFilteredJobs
        .map(job => {
         job.distance = dist(zipcode, job.gsx$zipcode.$t);
         return job;
        })
        .filter(jobs => jobs.distance <= 1000)
        .filter(job => job.title.$t.toLowerCase().includes(this.props.searchField.toLowerCase()));

      this.setState({
        filteredJobs: populateFilteredJobs
      })
    }
  }

  filterByEmploymentType = () => {
    const { employmentTypeFT, employmentTypePT, jobData} = this.props;
    let populateFilteredJobs = jobData;

   if (employmentTypeFT === true && employmentTypePT === true) {
      this.setState({
        filteredJobs: populateFilteredJobs
      })
    } else if (employmentTypeFT === true) {
      this.setState({
        filteredJobs: populateFilteredJobs.filter(job => job.gsx$duration.$t === 'Full-time')
      })
    } else if (employmentTypePT ===true) {
      this.setState({
      filteredJobs: populateFilteredJobs.filter(job => job.gsx$duration.$t.includes('Part-time'))
      })
    }

    populateFilteredJobs = this.state.filteredJobs
    .filter(job => job.title.$t.toLowerCase().includes(this.props.searchField.toLowerCase()))

    this.setState({
      filteredJobs: populateFilteredJobs
    })
  }

//searchField is for matching search to job listing
  render() {
    const { isPending, organizationData } = this.props;

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
              filteredJobs={this.state.filteredJobs}
              userJobTitle={this.userJobTitle}
              calcDistance={this.calcDistance}
              filterByEmploymentType={this.filterByEmploymentType}
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
