import React, { Component } from "react";
import CompanyCard from "./CompanyCard";
import Banner from "./Banner";
import "./Organizations.scss";
import { css } from "@emotion/core";
import { RotateLoader } from "react-spinners";
import * as regionService from "../services/region-service";

const override = css`
  display: block;
  margin: auto auto;
  border-color: red;
`;

class Organizations extends Component {
  state = {
    selectedRegionId: "",
    filteredOrganizations: []
  };

  async componentDidMount() {
    window.scroll(0, 0);
    this.filterOrganizations();
    regionService.getAll().then(result => {
      this.setState({ regions: result });
    });
  }

  handleChange = e => {
    this.setState({ selectedRegionId: e.target.value });
    this.filterOrganizations();
  };

  filterOrganizations = () => {
    this.setState(prevState => {
      if (!prevState.selectedRegionId) {
        return { filteredOrganizations: this.props.organizations };
      } else {
        const filteredOrganizations = this.props.organizations.filter(
          org =>
            org.regions &&
            org.regions.length > 0 &&
            org.regions.filter(
              region => region.id === parseInt(prevState.selectedRegionId)
            ).length > 0
        );
        return { filteredOrganizations };
      }
    });
  };

  render() {
    const { isPending, activeUser } = this.props;
    const { selectedRegionId, filteredOrganizations, regions } = this.state;
    return (
      <div>
        <Banner
          titleUpper="Organizations"
          titleLower="Involved"
          imageName="la-in-winter"
        />
        <div className="orgs-intro">
          <h2 className="intro-h2">Join the Fight Against Homelessness:</h2>
          <br />
          <p>
            Homeless service providers throughout Los Angeles county are looking
            for qualified, motivated individuals to join the vital field of
            homeless services. It's a meaningful way to contribute to the
            movement to combat and prevent homelessness across the county--and
            the "Help Wanted" sign is out.
          </p>
        </div>
        {isPending ? (
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
          <div
            className="organizations-content"
            // style={{ margin: "0.5em 2em 3em 2em" }}
          >
            <div
              className="organizations-page-options"
              // style={{
              //   display: "flex",
              //   flexDirection: "row",
              //   justifyContent: "space-between"
              // }}
            >
              <div className="region-select-container">
                <span title="Service Planning Area">{"Region "}</span>
                <select
                  className="region-select"
                  value={selectedRegionId}
                  onChange={this.handleChange}
                >
                  <option key="0" value="">
                    (Any Region)
                  </option>
                  {regions
                    ? regions.map(region => (
                        <option key={region.id} value={region.id}>
                          {region.name + " SPA" + region.spa.toString()}
                        </option>
                      ))
                    : null}
                </select>
              </div>

              {activeUser.role === "admin" ? (
                <div className="new-org-btn-container">
                  <a
                    href={`/organizations/0/edit`}
                    className="new-organization-btn"
                    // style={{
                    //   width: "auto",
                    //   margin: "0 1em 1em 0"
                    // }}
                  >
                    New Organization
                  </a>
                </div>
              ) : null}
            </div>
            <div className="organization-cards-container">
              {filteredOrganizations.map((org, index) => (
                <CompanyCard key={index} org={org} activeUser={activeUser} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Organizations;
