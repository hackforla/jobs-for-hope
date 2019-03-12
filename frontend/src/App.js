import React, { Component } from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";

import Navbar from "./components/Navbar";
import Jobs from "./components/Jobs";
import Organizations from "./components/Organizations";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

import * as jobService from "./services/job-service";
import * as organizationService from "./services/organization-service";

// import {
//   setSearchField,
//   setSearchZip,
//   fetchJobs,
//   fetchOrganizations,
//   setEmploymentTypeFT,
//   setEmploymentTypePT,
//   setDistance
// } from "./store/actions";

import "./App.scss";

// const mapStateToProps = state => ({
//   searchField: state.searchJobListing.searchField,
//   zipcode: state.searchJobListing.zipcode,

//   isPending: state.requestJobs.isPending,
//   jobData: state.requestJobs.jobData,
//   isError: state.requestJobs.isError,

//   orgsArePending: state.requestOrgs.orgsArePending,
//   organizationData: state.requestOrgs.organizationData,
//   orgsGetDataError: state.requestOrgs.orgsGetDataError,

//   employmentTypeFT: state.changeEmploymentType.FT,
//   employmentTypePT: state.changeEmploymentType.PT,

//   distance: state.changeDistance.distance
// });

// const mapDispatchToProps = dispatch => ({
//   onSearchChange: event => dispatch(setSearchField(event.target.value)),
//   onZipSearchChange: event => dispatch(setSearchZip(event.target.value)),

//   onfetchJobs: () => dispatch(fetchJobs()),
//   onfetchOrgs: () => dispatch(fetchOrganizations()),

//   onSetEmploymentTypeFT: event =>
//     dispatch(setEmploymentTypeFT(event.target.checked)),
//   onSetEmploymentTypePT: event =>
//     dispatch(setEmploymentTypePT(event.target.checked)),

//   onSetDistance: event => dispatch(setDistance(event.target.value))
// });

class App extends Component {
  state = {
    isPending: true,
    jobs: [],
    organizations: []
  };

  componentDidMount() {
    // this.props.onfetchJobs();
    // this.props.onfetchOrgs();
    organizationService
      .getAll()
      .then(organizations => {
        this.setState({ organizations });
        return jobService.getAll();
      })
      .then(jobs => {
        this.setState(prevState => {
          // Add logo property to each job, by "joining" with organizations by
          // name - when db has foreign key set up, we will be able to join by
          // organization id, instead.
          const jobsWithLogos = jobs.map(job => {
            const org = prevState.organizations.find(
              organization => organization["gsx$name"]["$t"] === job.org
            );
            job.logo = (org && org["gsx$logo"]["$t"]) || "";
            let type = [];
            const hours = (job.hours && job.hours.toLowerCase()) || "";
            if (hours.includes("full") || hours.includes("ft")) {
              type.push("Full-Time");
            }
            if (hours.includes("part") || hours.includes("pt")) {
              type.push("Part-Time");
            }
            job.hours = type.join(" / ");
            return job;
          });
          return { jobs: jobsWithLogos, isPending: false };
        });
      });
  }

  // calcDistance = () => {
  //   const { zipcode, jobData, distance } = this.props;
  //   let populateFilteredJobs = jobData;

  //   //this needs jobData again
  //   if (distance === "10") {
  //     //if jobTitle...gotta filter by job title first!
  //     //use zipcodes to calculate distance of each job posting: zipcode
  //     populateFilteredJobs = populateFilteredJobs
  //       .map(job => {
  //         job.distance = dist(zipcode, job.zipcode);
  //         return job;
  //       })
  //       .filter(jobs => jobs.distance <= 10)
  //       .filter(job =>
  //         job.title.toLowerCase().includes(this.props.searchField.toLowerCase())
  //       );

  //     this.setState({
  //       filteredJobs: populateFilteredJobs
  //     });
  //   } else if (distance === "25") {
  //     populateFilteredJobs = populateFilteredJobs
  //       .map(job => {
  //         job.distance = dist(zipcode, job.zipcode);
  //         return job;
  //       })
  //       .filter(jobs => jobs.distance <= 25)
  //       .filter(job =>
  //         job.title.toLowerCase().includes(this.props.searchField.toLowerCase())
  //       );

  //     this.setState({
  //       filteredJobs: populateFilteredJobs
  //     });
  //   } else if (distance === "1000") {
  //     populateFilteredJobs = populateFilteredJobs
  //       .map(job => {
  //         job.distance = dist(zipcode, job.zipcode);
  //         return job;
  //       })
  //       .filter(jobs => jobs.distance <= 1000)
  //       .filter(job =>
  //         job.title.toLowerCase().includes(this.props.searchField.toLowerCase())
  //       );

  //     this.setState({
  //       filteredJobs: populateFilteredJobs
  //     });
  //   }
  // };

  render() {
    const { isPending, organizations, jobs } = this.state;

    return isPending ? (
      <h1>Loading...</h1>
    ) : (
      <Router>
        <div className="App">
          <header className="header">
            <Navbar />
          </header>
          <Route
            exact
            path="/"
            render={() => (
              // <Jobs
              //   {...this.props}
              //   filteredJobs={this.state.filteredJobs}
              //   userJobTitle={this.userJobTitle}
              //   calcDistance={this.calcDistance}
              //   filterByEmploymentType={this.filterByEmploymentType}
              // />
              <Jobs jobs={jobs} />
            )}
          />
          <Route
            path="/organizations"
            render={() => <Organizations organizations={organizations} />}
          />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(App);
