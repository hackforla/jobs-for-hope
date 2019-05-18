import React, { Component } from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import { Provider as AlertProvider } from "react-alert";
import { AlertTemplate, alertOptions } from "./components/Alert";

import Navbar from "./components/Navbar";
import Jobs from "./components/Jobs";
import JobForm from "./components/JobForm";
import Organizations from "./components/Organizations";
import OrganizationForm from "./components/OrganizationForm";
import OrganizationView from "./components/OrganizationView";
import About from "./components/About";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Register from "./components/Register";
import Account from "./components/Account";
import ResetForm from "./components/ResetForm";
import Footer from "./components/Footer";

import * as jobService from "./services/job-service";
import * as organizationService from "./services/organization-service";
import { authCheck, handleLogOut } from "./services/auth-service";

import "./App.scss";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPending: true,
      activeUser: {},
      jobs: [],
      organizations: []
    };
    authCheck().then(user => this.setState({ activeUser: user }));
  }

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

  logOut = () => {
    handleLogOut().then(res => {
      if (res === "success") {
        window.location.href = "/";
      }
    });
  };

  render() {
    const { isPending, activeUser, organizations, jobs, requests } = this.state;
    return (
      <Router>
        <AlertProvider template={AlertTemplate} {...alertOptions}>
          <div className="App">
            <header className="header">
              <Navbar activeUser={activeUser} />
            </header>
            <Route
              exact
              path="/"
              render={() => (
                <Jobs
                  activeUser={activeUser}
                  jobs={jobs}
                  organizations={organizations}
                  key={isPending}
                  isPending={isPending}
                />
              )}
            />
            <Route
              exact
              path="/jobs/new/create"
              render={() => (
                <JobForm
                  activeUser={activeUser}
                  organizations={organizations}
                />
              )}
            />
            <Route
              exact
              path="/jobs/:organization_id"
              render={() => (
                <Jobs
                  activeUser={activeUser}
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
                  activeUser={activeUser}
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
                  activeUser={activeUser}
                />
              )}
            />
            <Route path="/organizations/:id" component={OrganizationForm} />
            <Route path="/organizationview/:id" component={OrganizationView} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route path="/login" render={() => <Login />} />
            <Route path="/register" render={() => <Register />} />
            <Route
              path="/reset/:token"
              render={matchProps => <ResetForm {...matchProps} />}
            />
            <Route
              path="/account"
              render={() => (
                <Account activeUser={activeUser} pendingRequests={requests} />
              )}
            />
            <Footer activeUser={activeUser} logOut={this.logOut} />
          </div>
        </AlertProvider>
      </Router>
    );
  }
}

export default App;
