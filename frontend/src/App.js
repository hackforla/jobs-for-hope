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

import { setSearchField, setSearchZip, fetchJobs, fetchOrganizations } from './store/actions';

import './App.scss';


const mapStateToProps = state => ({
  searchField: state.searchJobListing.searchField,
  zipcode: state.searchJobListing.zipcode,

  isPending: state.requestJobs.isPending,
  jobData: state.requestJobs.jobData,
  isError: state.requestJobs.isError,

  orgsArePending: state.requestOrgs.orgsArePending,
  organizationData: state.requestOrgs.organizationData,
  orgsGetDataError: state.requestOrgs.orgsGetDataError
})

const mapDispatchToProps = dispatch => ({
    onSearchChange: (event) => dispatch(setSearchField(event.target.value)),
    onZipSearchChange: (event) => dispatch(setSearchZip(event.target.value)),
    onfetchData: () => dispatch(fetchJobs()),
    onfetchOrgs: () => dispatch(fetchOrganizations())
})

  // let filteredJobs;

  // const filterSearch = () => {

  //   const { searchField, zipcode, jobData } = this.props;

  //   if (searchField){
  //   filteredJobs = jobData.filter(job => job.gsx$zipcode.$t.includes(zipcode))

  //   filteredJobs = filteredJobs.filter(job => job.title.$t.toLowerCase().includes(searchField.toLowerCase()))

  //   console.log(filteredJobs);
  //   } else {
  //     return filteredJobs = jobData;
  //   }
  // }


class App extends Component {

componentDidMount() {
  this.props.onfetchData();
  this.props.onfetchOrgs();
}

//searchField is for matching search to job listing
  render() {
    const { searchField, zipcode, jobData, isPending } = this.props;

    let filteredJobs;

    filteredJobs = jobData
    .filter(job => job.gsx$zipcode.$t.includes(zipcode))
    .filter(job => job.title.$t.toLowerCase().includes(searchField.toLowerCase()))

    console.log(filteredJobs);

    return isPending ?
      <h1>Loading...</h1> :
      (
      <Router>
        <div className="App">
          <header className="header">
            <Navbar />
          </header>
          <Route exact path='/' render={() => (
            <Main
              {...this.props}
              filteredJobs={filteredJobs}
              // filterSearch={filterSearch}
            />
          )}
          />
          <Route path='/organizations' component={Organizations} />
          <Route path='/about' component={About} />
          <Route path='/contact' component={Contact} />
          <Footer />
        </div>
      </Router>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);


