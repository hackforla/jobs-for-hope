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
import * as regionService from "./services/region-service";
import { authCheck, handleLogOut } from "./services/auth-service";

import "./App.scss";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPending: true,
      activeUser: authCheck().then(user => {
        this.setState({ activeUser: user });
      }),
      jobs: [],
      organizations: [],
      regions: [],
      navToggle: false
    };
  }

  fetchOrganizations = async () => {
    const regionServiceResult = await regionService.getAll();
    this.setState({ regions: regionServiceResult });
    organizationService
      .getAll()
      .then(organizations => {
        this.setState({
          organizations: organizations.filter(org => org.is_approved)
        });
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
            job.hours = type.length === 0 ? "Unspecified" : type.join(" / ");
            return job;
          });
          return { jobs: cleanedJobs, isPending: false };
        });
      });
  };

  componentDidMount() {
    this.fetchOrganizations();
  }

  logOut = () => {
    handleLogOut().then(res => {
      if (res === "success") {
        window.location.href = "/";
      }
    });
  };

  navToggler = () => {
    this.setState({
      navToggle: !this.state.navToggle
    });
  };

  render() {
    const {
      isPending,
      activeUser,
      organizations,
      jobs,
      requests,
      regions
    } = this.state;
    return (
      <Router>
        <AlertProvider template={AlertTemplate} {...alertOptions}>
          <div className="App">
            <header className="header">
              <Navbar
                toggle={this.state.navToggle}
                toggler={this.navToggler}
                activeUser={activeUser}
                logOut={this.logOut}
              />
            </header>
            <div
              className="route-container"
              onClick={() => this.setState({ navToggle: false })}
            >
              <Route
                exact
                path="/"
                render={() => (
                  <Jobs
                    activeUser={activeUser}
                    jobs={jobs}
                    organizations={organizations}
                    regions={regions}
                    key={isPending}
                    isPending={isPending}
                  />
                )}
              />
              <Route
                path="/jobs"
                exact
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
                path="/jobs/form/:id"
                render={matchProps => (
                  <JobForm
                    activeUser={activeUser}
                    jobs={jobs}
                    organizations={organizations}
                    regions={regions}
                    key={isPending}
                    isPending={isPending}
                    {...matchProps}
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
              <Route
                path="/organizations/:id/edit"
                render={matchProps => (
                  <OrganizationForm
                    {...matchProps}
                    fetchOrganizations={this.fetchOrganizations}
                    activeUser={activeUser}
                  />
                )}
              />
              <Route
                exact
                path="/organizations/:id"
                component={OrganizationView}
              />
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
                  <Account
                    activeUser={activeUser}
                    pendingRequests={requests}
                    jobs={jobs}
                  />
                )}
              />

              <Footer activeUser={activeUser} logOut={this.logOut} />
            </div>
          </div>
        </AlertProvider>
      </Router>
    );
  }
}

export default App;
