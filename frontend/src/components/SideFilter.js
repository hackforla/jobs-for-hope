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
  distanceZip
}) => {
  return (
    <aside className="filter-bar-container">
      <p className="filters-title"> FILTERS</p>
      <div className="distance filter-criteria">
        <p> Distance</p>
        <select
          value={radius}
          onChange={event => {
            onSetDistance(event);
          }}
          className="distance-selector"
        >
          <option value="">(Any)</option>
          <option value="10">10 miles</option>
          <option value="25">25 miles</option>
          <option value="50">50 miles</option>
        </select>
        <p style={{ fontSize: "small" }}>From Zip Code</p>
        <input
          value={distanceZip}
          onChange={e => {
            onSetDistanceZip(e);
          }}
          className="distance-zip"
        />
      </div>
      <div className="employment-type filter-criteria">
        <p>Employment Type</p>
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
      </div>
    </aside>
  );
};

export default SideFilter;
