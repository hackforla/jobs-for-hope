import React from "react";

import "./SideFilter.scss";


const SideFilter = ({
  onSetEmploymentTypeFT,
  onSetEmploymentTypePT,
  onSetDistance,
  onSetDistanceZip,
  employmentTypeFT,
  employmentTypePT,
  radius,
  distanceZip,
  regions,
  regionId,
  onSetRegionId,
  //props from SearchBox component
  onSearchChange,
  onZipSearchChange,
  organizations,
  onSetOrganization,
  organizationId
}) => {
  return (
    <aside className="filter-bar-container">
      <p className="filters-title">FILTERS</p>
      <div className="filter-column">
        <p className="filter-criteria-title">Job Title</p>
        <input
          type="search"
          className="search-input"
          name="keywords"
          placeholder="Job Title"
          onChange={onSearchChange}
        />
        <p className="filter-criteria-title">Sort Titles</p>
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

      <div className="organization-search">
        <div className="search-words-title">
          <h3> Organization</h3>
        </div>
        <div className="location-container">
          <select
            onChange={event => {
              onSetOrganization(event);
            }}
            value={organizationId}
            className="organization-input"
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
          <p title="Service Planning Area" className="filter-criteria-title">{"SPA "}</p>
          <select
            className="region-select"
            value={regionId}
            onChange={e => onSetRegionId(e.target.value)}
          >
            <option key="0" value="">
              (Any SPA)
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
        <p className="filter-criteria-title">Distance</p>
        <select
          value={radius}
          onChange={event => {
            onSetDistance(event);
          }}
          className="distance-selector"
        >
          <option value="">(Any)</option>
          <option value="0">(Exact)</option>
          <option value="10">10 miles</option>
          <option value="25">25 miles</option>
          <option value="50">50 miles</option>
        </select>
        <p className="filter-criteria-title">
          Location
        </p>
        <input
          value={distanceZip}
          placeholder="Zip Code"
          onChange={e => {
            onSetDistanceZip(e);
          }}
          className="distance-zip"
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
        <p className="filter-criteria-title">Employment Type</p>
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
};

export default SideFilter;
