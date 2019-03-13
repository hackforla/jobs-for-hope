import React from "react";

import Banner from "./Banner";
import "./About.scss";

const About = props => {
  return (
    <div>
      <Banner
        titleUpper={"A Paycheck With"}
        titleLower={"A Purpose"}
        imageName="homeless_sitting"
      />
      <div className="text">
        <div className="about-side-nav">
          <a href="#">Who We Are</a>
          <a href="#">Initiative</a>
          <a href="#">Our Efforts</a>
        </div>
        <div className="who-we-are">
          <h2 id="whoweare"> Los Angeles County </h2>
          <p id="pBlock">
            The County of Los Angeles provides services to the over 10 million
            residents who call Los County home. With more than 35 departments
            and 200 commissions the county operates one of the largest local
            government organizations in the world.{" "}
          </p>
          <a href="http://www.lacounty.gov">http://www.lacounty.gov</a>
        </div>
        <div className="initiative">
          <h2 id="initiative1">Los Angeles Homeless Initiative</h2>

          <br />
          <p>
            From Pomona to San Pedro, Echo Park to Eagle Rock, Central L.A. to
            Westwood, homeless encampments have cropped up in communities well
            outside Los Angeles’ traditional epicenter of homelessness.,
            downtown’s Skid Row. On street corners and sidewalks, along
            riverbeds and railways, in small communities and large cities, human
            suffering is on heartbreaking display. Some of our most vulnerable
            residents – families, individuals, veterans, youth, and the mentally
            ill – struggle to emerge from homelessness and rebuild their lives.
          </p>
          <br />
          <p>
            In response to the crisis, the Los Angeles County Homeless
            Initiative was created by the Board of Supervisors. Last year the
            Board approved <span> 47 strategies</span> that reach across
            government and the community boundaries to forge effective
            partnerships and get results. County voters on March 7 approved
            <span> Measure H</span>, which would provide an estimated $355
            million for 10 years to fun ongoing services and housing.
          </p>
          <br />
          <p>
            With the help of Measure H funds, new job opportunities for homeless
            service providers across Los Angeles will enable us to significantly
            ramp up service to those in need. These opportunities range from
            front-line outreach workers, housing navigators, to managers and
            executives. They are calling for qualified, motivates individuals to
            join the vital field of homeless services. It’s a meaningful way to
            contribute to the movement to combat and prevent homelessness across
            the Country – and the “Help Wanted” sign is out.
          </p>
        </div>
        <div className="efforts">
          <h2 id="ourefforts">Our Efforts</h2>

          <br />

          <p>
            From opening a new sobering center on Skid Row, to encouraging
            landlords to rent their empty units to homeless veterans, efforts
            are underway to hep residents find their way home across Los Angeles
            County.
          </p>
          <br />
          <p>
            On February 9, 2016, the Board of Supervisors approved an
            unprecedented action plan of nearly four dozen interlockings
            strategies – focusing on six key areas – to combat homelessness. The
            County engaged stakeholders across the region in confronting this
            shared humanitarian crisis. More than 100 community groups, 30
            cities and an array of County’s leaders joined together to create an
            ambitious but achievable path forward.
          </p>
          <br />
          <br />
          <div className="learn-more">
            <h3>Learn More:</h3>
            <br />
            <a href="">Collaboration with Faith Organizations</a>
            <br />
            <br />
            <a href="">C3 Outreach Team in Action</a>
            <br />
            <br />
            <a href="">Quarterly Report</a>
            <br />
            <br />
            <a href="">Impact Dashboard</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About
