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
  onSetRegionId
}) => {
  return (
    <aside className="filter-bar-container">
      <p className="filters-title"> FILTERS</p>
      <div className="distance filter-criteria">
        <p className="distance"> Distance</p>
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
        <p className="distance" style={{ fontSize: "small" }}>
          From Zip Code
        </p>
        <input
          value={distanceZip}
          onChange={e => {
            onSetDistanceZip(e);
          }}
          className="distance-zip"
        />
      </div>
      <div className="employment-type filter-criteria">
        <p className="employment-type-title">Employment Type</p>
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
        <div style={{ marginTop: "1em" }}>
          <p title="Service Planning Area">{"SPA "}</p>
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
    </aside>
  );
};

export default SideFilter;
