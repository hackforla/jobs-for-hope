import React from "react";
import SearchBox from "./SearchBox";
import JobPostings from "./JobPostings";
import SideFilter from "./SideFilter";
import "./Jobs.scss";
import Modal from "./Modal";
import { dist } from "../utils/utils";
import { css } from "@emotion/core";
import { RotateLoader } from "react-spinners";
import { withRouter, Link } from "react-router-dom";
import Paginator from "./Paginator";

const override = css`
  display: block;
  margin: auto auto;
  border-color: red;
`;

class Jobs extends React.Component {
  state = {
    isBusy: false,
    search: "",
    zipSearch: "",
    jobTitle: "",
    employmentTypeFT: false,
    employmentTypePT: false,
    radius: "",
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
    currentPage: 0
  };

  componentDidMount() {
    window.scroll(0, 0);
    const organizationId = this.props.match.params.organization_id;
    if (organizationId) {
      this.setState({ organizationId }, this.filterJobs);
    } else {
      this.filterJobs();
    }
  }

  handleChangeItemsPerPage = e => {
    this.setState(
      { itemsPerPage: parseInt(e.target.value), currentPage: 0 },
      this.paginateJobs
    );
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
      search,
      zipSearch,
      employmentTypeFT,
      employmentTypePT,
      radius,
      distanceZip,
      organizationId,
      regionId
    } = this.state;
    const filteredJobs = this.props.jobs
      .filter(job => {
        return (
          !organizationId || job.organization_id === Number(organizationId)
        );
      })
      .filter(job => job.zipcode.includes(zipSearch))
      .filter(job => job.title.toLowerCase().includes(search.toLowerCase()))
      .filter(this.getEmploymentTypeFilter(employmentTypeFT, employmentTypePT))
      .filter(this.getDistanceFilter(radius, distanceZip))
      .filter(this.getRegionFilter(regionId))
      // Sort by organization, position title
      .sort((a, b) => {
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
      });
    this.setState(prevState => {
      return {
        filteredJobs,
        itemCount: filteredJobs.length,
        isBusy: false,
        currentPage: 0
      };
    }, this.paginateJobs);
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

  onSearchChange = e => {
    this.setState({ search: e.target.value, isBusy: true }, this.filterJobs);
  };

  onZipSearchChange = e => {
    this.setState({ zipSearch: e.target.value, isBusy: true }, this.filterJobs);
  };

  onSetEmploymentTypeFT = checked => {
    this.setState({ employmentTypeFT: checked, isBusy: true }, this.filterJobs);
  };

  onSetEmploymentTypePT = checked => {
    this.setState({ employmentTypePT: checked, isBusy: true }, this.filterJobs);
  };

  onSetDistance = e => {
    this.setState({ radius: e.target.value, isBusy: true }, this.filterJobs);
  };

  onSetDistanceZip = e => {
    this.setState(
      { distanceZip: e.target.value, isBusy: true },
      this.filterJobs
    );
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
      paginatedJobs,
      userJobTitle,
      itemCount,
      organizationId,
      isBusy,
      totalPages,
      currentPage
    } = this.state;
    const {
      activeUser,
      employmentTypeFT,
      employmentTypePT,
      radius,
      distanceZip,
      regionId,
      regions
    } = this.props;
    return (
      <div>
        <div>
          {/* <Banner
            titleUpper="Work to Fight"
            titleLower="Homelessness"
            imageName="helping-hands2"
          /> */}
          <SearchBox
            onSearchChange={this.onSearchChange}
            onZipSearchChange={this.onZipSearchChange}
            userJobTitle={userJobTitle}
            organizations={this.props.organizations}
            organizationId={organizationId}
            onSetOrganization={this.onSetOrganization}
          />
          <div className="filters-postings-wrapper">
            <SideFilter
              onSetEmploymentTypeFT={this.onSetEmploymentTypeFT}
              onSetEmploymentTypePT={this.onSetEmploymentTypePT}
              onSetDistance={this.onSetDistance}
              onSetDistanceZip={this.onSetDistanceZip}
              employmentTypeFT={employmentTypeFT}
              employmentTypePT={employmentTypePT}
              radius={radius}
              distanceZip={distanceZip}
              regionId={regionId}
              regions={regions}
              onSetRegionId={this.onSetRegionId}
            />
            <section role="tablist" className="recent-postings-container">
              <div className="header-container">
                <h2 className="recent-postings-title">
                  Recent Job Postings {`(${itemCount})`}
                </h2>
                {activeUser.role === "admin" ||
                activeUser.role === "employer" ? (
                  <Link to={`/jobs/form/new`} id="new-job-btn">
                    Post a Job
                  </Link>
                ) : null}
              </div>
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
                  </select>
                ) : null}
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
