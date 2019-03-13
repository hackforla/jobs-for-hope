import React from "react";
import SearchBox from "./SearchBox";
import JobPostings from "./JobPostings";
import SideFilter from "./SideFilter";
import "./Jobs.css";
import Modal from "./Modal";
import { dist } from "../utils/utils";
import Paginator from "./Paginator";

class Jobs extends React.Component {
  state = {
    search: "",
    zipSearch: "",
    jobTitle: "",
    employmentTypeFT: true,
    employmentTypePT: true,
    radius: "",
    distanceZip: "",
    filteredJobs: [],
    paginatedJobs: [],
    itemsPerPage: 12,
    totalPages: 0,
    currentPage: 0,
    organization: "",
    organizations: []
  };

  componentDidMount() {
    this.setState({ organizations: this.getDistinctOrganizations() });
    this.filterJobs();
  }

  getDistinctOrganizations = () => {
    const orgs = [];
    for (let i = 0; i < this.props.jobs.length; i++) {
      const org = this.props.jobs[i].org;
      if (!orgs.includes(org)) {
        orgs.push(org);
      }
    }
    orgs.sort(org => org);
    return orgs;
  };

  paginateJobs = () => {
    this.setState(prevState => {
      const start = prevState.currentPage * prevState.itemsPerPage;
      const end = Math.min(
        start + prevState.itemsPerPage,
        prevState.filteredJobs.length + 1
      );
      const paginatedJobs = prevState.filteredJobs.slice(start, end);
      this.setState({ paginatedJobs });
    });
  };

  filterJobs = () => {
    const {
      search,
      zipSearch,
      employmentTypeFT,
      employmentTypePT,
      radius,
      distanceZip,
      itemsPerPage,
      organization
    } = this.state;
    const filteredJobs = this.props.jobs
      .filter(job => !organization || job.org === organization)
      .filter(job => job.zipcode.includes(zipSearch))
      .filter(job => job.title.toLowerCase().includes(search.toLowerCase()))
      .filter(this.getEmploymentTypeFilter(employmentTypeFT, employmentTypePT))
      .filter(this.getDistanceFilter(radius, distanceZip))
      // Sort by organization, position title
      .sort((a, b) => {
        if (a.org < b.org) {
          return -1;
        } else if (a.org > b.org) {
          return 1;
        } else if (a.title < b.title) {
          return -1;
        } else if (a.title > b.title) {
          return 1;
        }
        return 0;
      });
    this.setState(
      {
        filteredJobs,
        currentPage: 0,
        totalPages: Math.ceil(filteredJobs.length / itemsPerPage)
      },
      this.paginateJobs
    );
  };

  getEmploymentTypeFilter = (employmentTypeFT, employmentTypePT) => {
    if (employmentTypeFT && !employmentTypePT) {
      return job => job.hours.includes("Full-Time");
    } else if (employmentTypePT && !employmentTypeFT) {
      return job => job.hours.includes("Part-Time");
    }
    // If both FT and PT are selected OR neither are selected,
    // show all jobs (?)
    return job => true;
  };

  getDistanceFilter = (radius, originZip) => {
    if (radius && originZip) {
      return job => {
        // dist returns null if either arg is "" or invalid
        const distance = dist(job.zipcode, originZip);
        return distance && distance <= Number(radius);
      };
    }
    return job => true;
  };

  onSearchChange = e => {
    this.setState({ search: e.target.value }, this.filterJobs);
  };

  onZipSearchChange = e => {
    this.setState({ zipSearch: e.target.value }, this.filterJobs);
  };

  onSetEmploymentTypeFT = checked => {
    this.setState({ employmentTypeFT: checked }, this.filterJobs);
  };

  onSetEmploymentTypePT = checked => {
    this.setState({ employmentTypePT: checked }, this.filterJobs);
  };

  onSetDistance = e => {
    this.setState({ radius: e.target.value }, this.filterJobs);
  };

  onSetDistanceZip = e => {
    this.setState({ distanceZip: e.target.value }, this.filterJobs);
  };

  onSetOrganization = e => {
    this.setState({ organization: e.target.value }, this.filterJobs);
  };

  goToPage = pageNo => {
    this.setState({ currentPage: pageNo }, this.paginateJobs);
  };

  onChangeItemsPerPage = e => {
    this.setState({ itemsPerPage: Number(e.target.value) }, this.paginateJobs);
  };

  render() {
    const {
      paginatedJobs,
      userJobTitle,
      totalPages,
      currentPage,
      itemsPerPage,
      organizations
    } = this.state;
    return (
      <div>
        <SearchBox
          onSearchChange={this.onSearchChange}
          onZipSearchChange={this.onZipSearchChange}
          userJobTitle={userJobTitle}
          organizations={organizations}
          onSetOrganization={this.onSetOrganization}
        />
        <div className="filters-postings-wrapper">
          <SideFilter
            onSetEmploymentTypeFT={this.onSetEmploymentTypeFT}
            onSetEmploymentTypePT={this.onSetEmploymentTypePT}
            onSetDistance={this.onSetDistance}
            onSetDistanceZip={this.onSetDistanceZip}
          />
          <section role="tablist" className="recent-postings-container">
            <h2 className="recent-postings-title">Recent Job Postings</h2>
            <Paginator
              totalPages={totalPages}
              currentPage={currentPage}
              goTo={this.goToPage}
              buttonCount={7}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                margin: "0 12px 6px 0"
              }}
            >
              <span>
                <span style={{ margin: "2px 4px 2px 10px" }}>Page:</span>
                <span style={{ margin: "2px 4px" }}>{currentPage + 1}</span>
                <span style={{ margin: "2px 4px" }}>/</span>
                <span style={{ margin: "2px 14px 2px 4px" }}>{totalPages}</span>
              </span>
              <span>
                <span>{"Items Per Page: "}</span>
                <select
                  value={itemsPerPage}
                  onChange={this.onChangeItemsPerPage}
                >
                  <option value="6">6</option>
                  <option value="12">12</option>
                  <option value="18">18</option>
                  <option value="24">24</option>
                  <option value="48">48</option>
                </select>
              </span>
            </div>
            <ul>
              {paginatedJobs.map((job, index) => (
                <li key={index}>
                  <JobPostings job={job} />
                </li>
              ))}
            </ul>
            <Paginator
              totalPages={totalPages}
              currentPage={currentPage}
              goTo={this.goToPage}
              buttonCount={7}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                margin: "0 12px 6px 0"
              }}
            >
              <span>
                <span style={{ margin: "2px 4px 2px 10px" }}>Page:</span>
                <span style={{ margin: "2px 4px" }}>{currentPage + 1}</span>
                <span style={{ margin: "2px 4px" }}>/</span>
                <span style={{ margin: "2px 14px 2px 4px" }}>{totalPages}</span>
              </span>
              <span>
                <span>{"Items Per Page: "}</span>
                <select
                  value={itemsPerPage}
                  onChange={this.onChangeItemsPerPage}
                >
                  <option value="6">6</option>
                  <option value="12">12</option>
                  <option value="18">18</option>
                  <option value="24">24</option>
                  <option value="48">48</option>
                </select>
              </span>
            </div>
          </section>
        </div>
        <Modal />
      </div>
    );
  }
}

export default Jobs;
