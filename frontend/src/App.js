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
import "./App.scss";

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
          <Route exact path="/" render={() => <Jobs jobs={jobs} />} />
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
