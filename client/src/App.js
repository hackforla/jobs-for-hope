import React, { Component } from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";

import Navbar from "./components/Navbar";
import Jobs from "./components/Jobs";
import Organizations from "./components/Organizations";
import OrganizationForm from "./components/OrganizationForm"
import OrganizationView from "./components/OrganizationView"
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
          // Process each job to clean up db data. At present, this means:
          // 1. normalize hours property to say "", "Full-Time", "Part-Time"
          // or ""Full-Time / Part-Time"
          const cleanedJobs = jobs.map(job => {
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
          return { jobs: cleanedJobs, isPending: false };
        });
      });
  }

  render() {
    const { isPending, organizations, jobs } = this.state;

    return (
      <Router>
        <div className="App">
          <header className="header">
            <Navbar />
          </header>

          <Route
            exact
            path="/"
            render={() => (
              <Jobs
                jobs={jobs}
                organizations={organizations}
                key={isPending}
                isPending={isPending}
              />
            )}
          />
          <Route
            exact
            path="/jobs/:organization_id"
            render={() => (
              <Jobs
                jobs={jobs}
                organizations={organizations}
                key={isPending}
                isPending={isPending}
              />
            )}
          />
          <Route
            exact
            path="/organizations"
            render={() => (
              <Organizations
                organizations={organizations}
                isPending={isPending}
                key={isPending}
              />
            )}
          />
          <Route
            path="/organizations/:id"
            component={OrganizationForm }
          />
          <Route
            path="/organizationview/:id"
            component={OrganizationView }
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
