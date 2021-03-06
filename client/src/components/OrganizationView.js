import React from "react";
import "./OrganizationForm.scss";
import Banner from "./Banner";
import "./OrganizationView.scss";
import * as organizationService from "../services/organization-service";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { css } from "@emotion/core";
import { RotateLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";

const override = css`
  display: block;
  margin: auto auto;
  border-color: red;
`;

const initialValues = {
  id: 0,
  name: "",
  url: "",
  logo: "",
  mission: "",
  description: "",
  street: "",
  suite: "",
  city: "",
  state: "",
  zip: "",
  latitude: "",
  longitude: "",
  phone: "",
  email: ""
};

class OrganizationView extends React.Component {
  constructor(props) {
    super(props);
    this.id = props.match.params.id || 0;
    this.state = {
      org: initialValues,
      toOrganizations: false,
      loading: true
    };
  }

  componentDidMount() {
    window.scroll(0, 0);
    if (this.id) {
      organizationService.get(this.id).then(resp => {
        this.id = resp.id;
        this.setState({ org: resp, loading: false });
      });
    }
  }

  handleClose = () => {
    this.setState({ toOrganizations: true });
  };

  createDescription = function(description) {
    return { __html: description };
  };

  render() {
    const { org, toOrganizations } = this.state;
    const contactIsNotNull =
      org.street || org.phone || org.email ? true : false;
    if (toOrganizations) {
      return <Redirect to="/organizations" />;
    }
    const descr = "<div>" + org.description + "</div>";
    return (
      <React.Fragment>
        <Banner
          titleUpper="Organizations"
          titleLower="Involved"
          imageName="city"
        />
        {this.state.loading ? (
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
          <div className="organization-view-container">
            <div className="organization-content">
              <div className="organization-info">
                <div className="back-button-container">
                  <div className="org-link">
                    <a
                      className="new-organization-btn website-btn"
                      href={
                        org.url.toLowerCase().startsWith("http")
                          ? org.url
                          : "http://" + org.url
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Website
                    </a>
                  </div>
                  <button id="close-btn" onClick={this.handleClose}>
                    Back to Organizations
                  </button>
                </div>
                <h1>{org.name}</h1>
                <Link to={"/?organizationId=" + org.id} id="org-jobs-available">
                  {org.job_count} Jobs Available
                </Link>
                {org.mission ? (
                  <blockquote className="organization-mission">
                    <em>{`"${org.mission}"`}</em>
                  </blockquote>
                ) : null}
                <div
                  className="organization-description"
                  dangerouslySetInnerHTML={this.createDescription(descr)}
                />
              </div>
              <div
                className="organization-contact"
                style={contactIsNotNull ? null : { display: "none" }}
              >
                {contactIsNotNull ? <p>Contact {org.name}</p> : null}
                <div style={{ margin: "1em 0 0 0" }}>
                  {`${org.street} ${org.suite}`}
                </div>
                {org && org.city ? (
                  <div style={{ margin: "0 0 0.5em 0" }}>
                    {`${org.city}, ${org.state}  ${org.zip}`}
                  </div>
                ) : null}
                {org && org.phone ? (
                  <div style={{ margin: "0.5em" }}>
                    <FontAwesomeIcon
                      icon={faPhone}
                      style={{ marginRight: "0.5em" }}
                    />
                    {org.phone}
                  </div>
                ) : null}
                {org && org.email ? (
                  <div style={{ margin: "0.5em" }}>
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      style={{ marginRight: "0.5em" }}
                    />
                    {org.email}
                  </div>
                ) : null}
                <div style={{ marginTop: "1em" }}>SPA:</div>
                <ul style={{ margin: "0" }}>
                  {org.regions.map(region => (
                    <li style={{ marginLeft: "-1em" }} key={region.id}>
                      {region.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default OrganizationView;
