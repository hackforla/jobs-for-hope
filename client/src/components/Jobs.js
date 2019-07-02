import React from "react";
import JobPostings from "./JobPostings";
import JobFilters from "./JobFilters";
import "./Jobs.scss";
import Modal from "./Modal";
import { dist } from "../utils/utils";
import { css } from "@emotion/core";
import { RotateLoader } from "react-spinners";
import { withRouter, Link } from "react-router-dom";
import Paginator from "./Paginator";
import Banner from "./Banner";
import queryString from "query-string";

const override = css`
  display: block;
  margin: auto auto;
  border-color: red;
`;

class Jobs extends React.Component {
  state = {
    isBusy: false,
    jobTitle: "",
    employmentTypeFT: false,
    employmentTypePT: false,
    employmentTypeUnspecified: false,
    distanceRadius: "0",
    distanceZip: "",
    regionId: "",
    filteredJobs: [],
    paginatedJobs: [],
    itemCount: 0,
    organizationId: "", // Needs to be tracked as a string, e.g. "3", for compatibility with select option values
    organizations: [],
    modalVisible: false,
    modalJob: null,
    itemsPerPage: 10,
    totalPages: 0,
    currentPage: 0,
    sortBy: "PositionTitle"
  };

  componentDidMount() {
    window.scroll(0, 0);
    // To implement deep-linking, check for query string parameters
    // that may initialize search criteria.
    const queryStrings = queryString.parse(this.props.location.search);
    const organizationId = queryStrings.organizationId || "";
    const regionId = queryStrings.regionId || "";
    const jobTitle = queryStrings.jobTitle || "";
    const distanceZip = queryStrings.distanceZip || "";
    const distanceRadius = queryStrings.distanceRadius || "0";
    const employmentTypeFT = queryStrings.employmentTypeFT || false;
    const employmentTypePT = queryStrings.employmentTypePT || false;
    const employmentTypeUnspecified =
      queryStrings.employmentTypeUnspecified || false;

    this.setState(
      {
        organizationId,
        regionId,
        jobTitle,
        distanceZip,
        distanceRadius,
        employmentTypeFT,
        employmentTypePT,
        employmentTypeUnspecified
      },
      this.filterJobs
    );
  }

  pushCriteriaToHistory = () => {
    const {
      organizationId,
      regionId,
      jobTitle,
      distanceZip,
      distanceRadius,
      employmentTypeFT,
      employmentTypePT,
      employmentTypeUnspecified
    } = this.state;
    const queryStrings = {};
    if (organizationId) {
      queryStrings.organizationId = organizationId;
    }
    if (regionId) {
      queryStrings.regionId = regionId;
    }
    if (distanceZip) {
      queryStrings.distanceZip = distanceZip;
    }
    if (distanceRadius !== "0" && distanceRadius) {
      queryStrings.distanceRadius = distanceRadius;
    }
    if (jobTitle) {
      queryStrings.jobTitle = jobTitle;
    }
    if (employmentTypeFT) {
      queryStrings.employmentTypeFT = employmentTypeFT;
    }
    if (employmentTypePT) {
      queryStrings.employmentTypePT = employmentTypePT;
    }
    if (employmentTypeUnspecified) {
      queryStrings.employmentTypeUnspecified = employmentTypeUnspecified;
    }
    const qs = queryString.stringify(queryStrings);
    console.log(this.props);
    const url = this.props.location.pathname + "?" + qs;
    this.props.history.push(url);
  };

  handleChangeItemsPerPage = e => {
    this.setState(
      { itemsPerPage: parseInt(e.target.value), currentPage: 0 },
      this.paginateJobs
    );
  };

  handleChangeSortBy = e => {
    this.setState({ sortBy: e.target.value }, this.filterJobs);
  };

  paginateJobs = () => {
    this.setState(prevState => {
      const paginatedJobs =
        prevState.filteredJobs &&
        prevState.filteredJobs.filter((value, index) => {
          const first = prevState.currentPage * prevState.itemsPerPage;
          return index >= first && index < first + prevState.itemsPerPage;
        });
      return {
        paginatedJobs,
        totalPages: Math.ceil(
          prevState.filteredJobs.length / prevState.itemsPerPage
        )
      };
    });
  };

  goToPage = pageNumber => {
    this.setState({ currentPage: pageNumber }, this.paginateJobs);
  };

  filterJobs = () => {
    const {
      jobTitle,
      distanceZip,
      distanceRadius,
      employmentTypeFT,
      employmentTypePT,
      employmentTypeUnspecified,
      organizationId,
      regionId,
      sortBy
    } = this.state;
    const selectedJobs = this.props.jobs
      .filter(job => {
        return (
          !organizationId || job.organization_id === Number(organizationId)
        );
      })
      .filter(job => job.title.toLowerCase().includes(jobTitle.toLowerCase()))
      .filter(
        this.getEmploymentTypeFilter(
          employmentTypeFT,
          employmentTypePT,
          employmentTypeUnspecified
        )
      )
      .filter(this.getRegionFilter(regionId))
      .filter(this.getDistanceFilter(distanceRadius, distanceZip));
    //Sort by organization, position title
    let filteredJobs = [];
    let sortByFunction = this.sortByTitleOrganization;
    switch (sortBy) {
      case "Organization":
        sortByFunction = this.sortByOrganizationTitle;
        break;
      default:
        sortByFunction = this.sortByTitleOrganization;
        break;
    }
    filteredJobs = selectedJobs.sort(sortByFunction);

    // Update the address bar and browser history to
    // include current search criteria as query string params
    this.pushCriteriaToHistory();

    this.setState(prevState => {
      return {
        filteredJobs,
        itemCount: filteredJobs.length,
        isBusy: false,
        currentPage: 0
      };
    }, this.paginateJobs);
  };

  sortByOrganizationTitle = (a, b) => {
    // If filtering by location, unknown locations are after known locations
    if (this.state.distanceZip) {
      if (a.zipcode && !b.zipcode) {
        return -1;
      } else if (!a.zipcode && b.zipcode) {
        return 1;
      }
    }
    if (a.organization_name < b.organization_name) {
      return -1;
    } else if (a.organization_name > b.organization_name) {
      return 1;
    } else if (a.title < b.title) {
      return -1;
    } else if (a.title > b.title) {
      return 1;
    }
    return 0;
  };

  sortByTitleOrganization = (a, b) => {
    // console.log("hit sort");
    // If filtering by location, unknown locations are after known locations
    if (this.state.distanceZip) {
      if (a.zipcode && !b.zipcode) {
        return -1;
      } else if (!a.zipcode && b.zipcode) {
        return 1;
      }
    }
    if (a.title < b.title) {
      return -1;
    } else if (a.title > b.title) {
      return 1;
    } else if (a.organization_name < b.organization_name) {
      return -1;
    } else if (a.organization_name > b.organization_name) {
      return 1;
    } else return 0;
  };

  getEmploymentTypeFilter = (
    employmentTypeFT,
    employmentTypePT,
    employmentTypeUnspecified
  ) => {
    // If user does not check any boxes, then don't apply filter
    if (!employmentTypeFT && !employmentTypePT && !employmentTypeUnspecified) {
      return job => true;
    } else {
      return job => {
        if (employmentTypeFT && job.hours.includes("Full-Time")) {
          return true;
        } else if (employmentTypePT && job.hours.includes("Part-Time")) {
          return true;
        } else if (
          employmentTypeUnspecified &&
          job.hours.includes("Unspecified")
        ) {
          return true;
        } else {
          return false;
        }
      };
    }
  };

  getRegionFilter = regionId => {
    if (!regionId) {
      return job => true;
    } else {
      const orgIds = this.props.organizations
        .filter(org => {
          return org.regions
            .map(region => region.id)
            .includes(Number(regionId));
        })
        .map(o => o.id);
      return job => orgIds.includes(job.organization_id);
    }
  };

  onSetJobTitle = e => {
    this.setState({ jobTitle: e.target.value, isBusy: true }, this.filterJobs);
  };

  onSetEmploymentTypeFT = checked => {
    this.setState({ employmentTypeFT: checked, isBusy: true }, this.filterJobs);
  };

  onSetEmploymentTypePT = checked => {
    this.setState({ employmentTypePT: checked, isBusy: true }, this.filterJobs);
  };

  onSetEmploymentTypeUnspecified = checked => {
    this.setState(
      { employmentTypeUnspecified: checked, isBusy: true },
      this.filterJobs
    );
  };

  onSetDistanceRadius = e => {
    const distanceZip = e.target.value === "" ? "" : this.state.distanceZip;
    this.setState(
      {
        distanceRadius: e.target.value,
        distanceZip: distanceZip,
        isBusy: true
      },
      this.filterJobs
    );
  };

  onSetDistanceZip = e => {
    this.setState({ distanceZip: e.target.value }, this.filterJobs);
  };

  getDistanceFilter = (distanceRadius, originZip) => {
    if (originZip && originZip.length === 5) {
      if (Number(distanceRadius) === 0) {
        return job => job.zipcode === originZip || !job.zipcode;
      } else {
        return job => {
          // dist returns null if either arg is "" or invalid
          const distanceDifference = dist(job.zipcode, originZip);
          // return distanceDifference == 0 || distanceDifference && distanceDifference <= Number(distanceRadius)
          return (
            !distanceDifference || distanceDifference <= Number(distanceRadius)
          );
        };
      }
    } else {
      return job => job;
    }
  };

  onSetOrganization = e => {
    this.setState(
      {
        organizationId: e.target.value ? Number(e.target.value) : "",
        isBusy: true
      },
      this.filterJobs
    );
  };

  onSetRegionId = regionId => {
    this.setState(
      { regionId: regionId ? Number(regionId) : "", isBusy: true },
      this.filterJobs
    );
  };

  onShowModal = job => {
    this.setState({
      modalVisible: true,
      modalJob: job
    });
  };

  onHideModal = () => {
    this.setState({ modalVisible: false, modalJob: null });
  };

  render() {
    const {
      jobTitle,
      organizationId,
      regionId,
      distanceRadius,
      distanceZip,
      employmentTypeFT,
      employmentTypePT,
      employmentTypeUnspecified,
      paginatedJobs,
      itemCount,
      isBusy,
      totalPages,
      currentPage,
      sortBy
    } = this.state;
    const { activeUser, regions, organizations } = this.props;

    return (
      <div>
        <div>
          <Banner
            titleUpper="Work to Fight"
            titleLower="Homelessness"
            imageName="helping-hands2"
          />

          <div className="filters-postings-wrapper">
            {" "}
            {/* might not need this wrapper anymore, moved filters out */}
            <JobFilters
              regions={regions}
              organizations={organizations}
              jobTitle={jobTitle}
              onSetJobTitle={this.onSetJobTitle}
              organizationId={organizationId}
              onSetOrganization={this.onSetOrganization}
              regionId={regionId}
              onSetRegionId={this.onSetRegionId}
              distanceRadius={distanceRadius}
              onSetDistanceRadius={this.onSetDistanceRadius}
              distanceZip={distanceZip}
              onSetDistanceZip={this.onSetDistanceZip}
              employmentTypeFT={employmentTypeFT}
              onSetEmploymentTypeFT={this.onSetEmploymentTypeFT}
              employmentTypePT={employmentTypePT}
              onSetEmploymentTypePT={this.onSetEmploymentTypePT}
              employmentTypeUnspecified={employmentTypeUnspecified}
              onSetEmploymentTypeUnspecified={
                this.onSetEmploymentTypeUnspecified
              }
              sortBy={sortBy}
              handleChangeSortBy={this.handleChangeSortBy}
            />
            <section role="tablist" className="recent-postings-container">
              <div className="header-container">
                <h2 className="recent-postings-title">
                  Recent Job Postings {`(${itemCount})`}
                </h2>
              </div>
              <div className="post-sort-wrapper">
                {activeUser.role === "admin" ||
                activeUser.role === "employer" ? (
                  <Link to={`/jobs/form/new`} id="new-job-btn">
                    Post a Job
                  </Link>
                ) : null}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ marginBottom: "0.2em", marginRight: "0.5em" }}>
                    {"Sort By: "}
                  </span>
                  <span>
                    <select
                      className="sort-selector"
                      value={this.sortBy}
                      onChange={this.handleChangeSortBy}
                    >
                      <option value="PositionTitle">Position Title</option>
                      <option value="Organization">Organization</option>
                    </select>
                  </span>
                </div>
              </div>
              {this.props.isPending || isBusy ? (
                <div
                  style={{
                    height: "200",
                    width: "100%",
                    margin: "100px auto",
                    display: "flex",
                    justifyContent: "space-around"
                  }}
                >
                  <RotateLoader
                    css={override}
                    sizeUnit={"px"}
                    size={15}
                    color={"#266294"}
                    loading={true}
                  />
                </div>
              ) : (
                <ul>
                  {paginatedJobs.map((job, index) => (
                    <li key={index}>
                      <JobPostings
                        job={job}
                        activeUser={this.props.activeUser}
                        onShowModal={this.onShowModal}
                      />
                    </li>
                  ))}
                </ul>
              )}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  marginBottom: "2em",
                  alignItems: "center"
                }}
              >
                <Paginator
                  totalPages={totalPages}
                  currentPage={currentPage}
                  goTo={this.goToPage}
                  buttonCount={window.innerWidth > 500 ? 5 : 3}
                />
                {itemCount > 0 ? (
                  <select
                    style={{ marginLeft: ".5em" }}
                    className="page-select"
                    value={this.itemsPerPage}
                    onChange={this.handleChangeItemsPerPage}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="1000">1000</option>
                  </select>
                ) : null}
              </div>
            </section>
          </div>
          <Modal
            modalVisible={this.state.modalVisible}
            modalJob={this.state.modalJob}
            onHideModal={this.onHideModal}
            isUserCreated={this.state.isUserCreated}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(Jobs);
