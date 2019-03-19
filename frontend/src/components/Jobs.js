import React from "react";
import SearchBox from "./SearchBox";
import JobPostings from "./JobPostings";
import SideFilter from "./SideFilter";
import "./Jobs.scss";
import Modal from "./Modal";
import { dist } from "../utils/utils";
import { css } from "@emotion/core";
import { RotateLoader } from "react-spinners";

const override = css`
  display: block;
  margin: auto auto;
  border-color: red;
`;

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
    itemCount: 0,
    organizationId: "",
    organizations: [],
    modalVisible: false,
    modalJob: null
  };

  componentDidMount() {
    this.filterJobs();
  }

  filterJobs = () => {
    const {
      search,
      zipSearch,
      employmentTypeFT,
      employmentTypePT,
      radius,
      distanceZip,
      organizationId
    } = this.state;
    const filteredJobs = this.props.jobs
      .filter(job => {
        return !organizationId || job.organization_id === organizationId;
      })
      .filter(job => job.zipcode.includes(zipSearch))
      .filter(job => job.title.toLowerCase().includes(search.toLowerCase()))
      .filter(this.getEmploymentTypeFilter(employmentTypeFT, employmentTypePT))
      .filter(this.getDistanceFilter(radius, distanceZip))
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
    this.setState({
      filteredJobs,
      itemCount: filteredJobs.length
    });
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
    this.setState(
      { organizationId: e.target.value ? Number(e.target.value) : "" },
      this.filterJobs
    );
  };

  onShowModal = job => {
    this.setState({ modalVisible: true, modalJob: job });
  };

  onHideModal = () => {
    this.setState({ modalVisible: false, modalJob: null });
  };

  render() {
    const { filteredJobs, userJobTitle, itemCount } = this.state;
    return (
      <div>
        {this.props.isPending ? (
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
          <div>
            <SearchBox
              onSearchChange={this.onSearchChange}
              onZipSearchChange={this.onZipSearchChange}
              userJobTitle={userJobTitle}
              organizations={this.props.organizations}
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
                <h2 className="recent-postings-title">
                  Recent Job Postings {`(${itemCount})`}
                </h2>
                <ul>
                  {filteredJobs.map((job, index) => (
                    <li key={index}>
                      <JobPostings job={job} onShowModal={this.onShowModal} />
                    </li>
                  ))}
                </ul>
              </section>
            </div>
            }
            <Modal
              modalVisible={this.state.modalVisible}
              modalJob={this.state.modalJob}
              onHideModal={this.onHideModal}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Jobs;
