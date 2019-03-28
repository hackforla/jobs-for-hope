import React from "react";
import CompanyCard from "./CompanyCard";
import Banner from "./Banner";
import "./Organizations.scss";
import { css } from "@emotion/core";
import { RotateLoader } from "react-spinners";

const override = css`
  display: block;
  margin: auto auto;
  border-color: red;
`;

const Organizations = ({ organizations, isPending }) => (
  <div>
    <Banner titleUpper="Organizations" titleLower="Involved" imageName="city" />
    <div className="orgs-intro">
      <h2 className="intro-h2">Join the Fight Against Homelessness:</h2>
      <br />
      <p>
        Homeless service providers throughout Los Angeles county are looking for
        qualified, motivated individuals to join the vital field of homeless
        services. It's a meaningful way to contribute to the movement to combat
        and prevent homelessness across the county--and the "Help Wanted" sign
        is out.
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
      <div className="organization-cards-container">
        {organizations.map((org, index) => (
          <CompanyCard key={index} org={org} />
        ))}
      </div>
    )}
  </div>
)

export default Organizations