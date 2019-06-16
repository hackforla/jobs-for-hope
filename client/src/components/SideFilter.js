import React from "react";
import "./SideFilter.scss";


// const SideFilter = ({
//   onSetEmploymentTypeFT,
//   onSetEmploymentTypePT,

//   onSetDistanceRadius,
//   onSetDistanceZip,

//   employmentTypeFT,
//   employmentTypePT,
//   radius,
//   distanceZip,
//   regions,
//   regionId,
//   onSetRegionId,
//   //props from SearchBox component
//   onSearchChange, //job title

//   onZipSearchChange, //auto 

//   organizations,
//   onSetOrganization,
//   organizationId
// }) => {

class SideFilter extends React.Component {

  constructor(props) {
    super(props)
  }
  render() {
    const {
      onSetEmploymentTypeFT,
      onSetEmploymentTypePT,

      onSetDistanceRadius,
      onSetDistanceZip,

      employmentTypeFT,
      employmentTypePT,
      radius,
      distanceZip,
      regions,
      regionId,
      onSetRegionId,
      //props from SearchBox component
      onSearchChange, //job title

      onZipSearchChange, //auto 

      organizations,
      onSetOrganization,
      organizationId
    } = this.props
    return (<aside className="filter-bar-container" >
      <p className="filter-title">FILTERS</p>
      <div className="filter-column">
        <p className="filter-title">Job Title</p>
        <input
          type="search"
          className="title-input"
          name="keywords"
          placeholder="Job Title"
          onChange={onSearchChange}
        />
        <p className="filter-title">Sort Titles</p>
        <div className="filter-options">
          <input
            name="a-z"
            type="radio"
            checked={employmentTypeFT}
            onChange={event => {
              onSetEmploymentTypeFT(event.target.checked);
            }}
          />
          <p>A - Z</p><br />
        </div>
        <div className="filter-options">
          <input
            name="z-a"
            type="radio"
            checked={employmentTypePT}
            onChange={event => {
              onSetEmploymentTypePT(event.target.checked);
            }}
          />
          <p>Z - A</p> <br />
        </div>
      </div>

      <div className="filter-column">
        <p className="filter-title">Organization</p>
        <div>
          <select
            onChange={event => {
              onSetOrganization(event);
            }}
            value={organizationId}
            className="organization-selector"
          >
            <option value="">(Any)</option>

            {organizations &&
              organizations.map(org => {
                return (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                );
              })}
          </select>
        </div>
        <div>
          <p className="filter-title">Region</p>
          <select
            className="region-selector"
            value={regionId}
            onChange={e => onSetRegionId(e.target.value)}
          >
            <option key="0" value="">
              (Any)
        </option>
            {regions
              ? regions.map(region => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))
              : null}
          </select>
        </div>
      </div>




      <div className="filter-column">
        <p className="filter-title">Distance</p>
        <select
          value={radius}
          onChange={event => {
            onSetDistanceRadius(event);
          }}
          className="distance-selector"
        >
          <option value="">(Any)</option>
          <option value="0">(Exact)</option>
          <option value="10">10 miles</option>
          <option value="25">25 miles</option>
          <option value="50">50 miles</option>
        </select>
        <p className="filter-title">
          Location
    </p>
        <input
          value={distanceZip}
          placeholder="Zip Code"
          onChange={e => {
            onSetDistanceZip(e); //with radius
            onZipSearchChange(e) //auto
          }}
          className="zip-input"
        />

        {/* AUTO FILTER  ZIP*/}
        <div className="location-search">
          <div className="location-container">
            <input
              type="search"
              className="location-input"
              name="location"
              placeholder="Zip Code"
              onChange={onZipSearchChange}
            />
          </div>
        </div>
      </div>



      <div className="filter-column">
        <p className="filter-title">Employment Type</p>
        <div className="filter-options">
          <input
            name="full-time"
            type="checkbox"
            checked={employmentTypeFT}
            onChange={event => {
              onSetEmploymentTypeFT(event.target.checked);
            }}
          />
          <p>Full Time</p> <br />
        </div>
        <div className="filter-options">
          <input
            name="part-time"
            type="checkbox"
            checked={employmentTypePT}
            onChange={event => {
              onSetEmploymentTypePT(event.target.checked);
            }}
          />
          <p>Part Time</p> <br />
        </div>
        <div className="filter-options">
          <input
            name="full-time"
            type="checkbox"
            checked={employmentTypeFT}
            onChange={event => {
              onSetEmploymentTypeFT(event.target.checked);
            }}
          />
          <p>Uncategorized (Doesn't work yet)</p>
        </div>
      </div>
    </aside>

    );
  }
};

export default SideFilter;
