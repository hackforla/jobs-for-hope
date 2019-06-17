import React from "react";
import "./JobFilters.scss";


const JobFilters = ({
  onSetJobTitle,
  onSetEmploymentTypeFT,
  onSetEmploymentTypePT,
  onSortTitlesAZ,
  onSortTitlesZA,
  onSetDistanceRadius,
  onSetDistanceZip,
  onSetRegionId,
  onSetOrganization,
  employmentTypeFT,
  employmentTypePT,
  employmentTypeUnspecified,
  sortTitlesAZ,
  sortTitlesZA,
  distanceRadius,
  distanceZip,
  regions,
  regionId,
  organizations,
  organizationId
}) => (<aside className="filter-bar-container">
  <div className="filter-column">
    <div className="filter-wrapper">
      <p className="filter-title">Job Title</p>
      <input type="search" className="title-input" name="keywords" placeholder="Job Title" onChange={onSetJobTitle} />
    </div>
    <div className="filter-wrapper">
      <p className="filter-title">Sort Titles</p>
      <div className="filter-options">
        <input name="a-z" type="radio" checked={sortTitlesAZ} onChange={event => {
          //TODO: add logic for sort
          // onSortTitlesAZ(event.target.checked)
        }} />
        <p>A - Z</p><br />
      </div>
    </div>
    <div className="filter-options">
      <input name="z-a" type="radio" checked={sortTitlesZA} onChange={event => {
        //TODO: add logic for sort
        // onSortTitlesZA(event.target.checked)
      }} />
      <p>Z - A</p> <br />
    </div>
  </div>




  <div className="filter-column">
    <div className="filter-wrapper">
      <p className="filter-title">Organization</p>
      <div>
        <select onChange={event => {
          onSetOrganization(event);
        }} value={organizationId} className="organization-selector">
          <option value="">(Any)</option>

          {organizations &&
            organizations.map(org => {
              return (<option key={org.id} value={org.id}>
                {org.name}
              </option>);
            })}
        </select>
      </div>
    </div>
    <div className="filter-wrapper">
      <p className="filter-title">Region</p>
      <select className="region-selector" value={regionId} onChange={e => onSetRegionId(e.target.value)}>
        <option key="0" value="">
          (Any)
        </option>
        {regions
          ? regions.map(region => (<option key={region.id} value={region.id}>
            {region.name}
          </option>))
          : null}
      </select>
    </div>
  </div>

  <div className="filter-column">
    <div className="filter-wrapper">
      <p className="filter-title">Distance</p>
      <select value={distanceRadius} onChange={event => {
        onSetDistanceRadius(event);
      }} className="distance-selector">
        <option value="">(Any)</option>
        <option value="0">(Exact)</option>
        <option value="10">10 miles</option>
        <option value="25">25 miles</option>
        <option value="50">50 miles</option>
      </select>
    </div>
    <div className="filter-wrapper">
      <p className="filter-title">
        Location
      </p>
      <input value={distanceZip} placeholder="Zip Code" onChange={event => {
        onSetDistanceZip(event);
      }} className="zip-input" />
    </div>
  </div>

  <div className="filter-column">
    <div className="filter-wrapper">
      <p className="filter-title">Employment Type</p>
      <div className="filter-options">
        <input name="full-time" type="checkbox" checked={employmentTypeFT} onChange={event => {
          onSetEmploymentTypeFT(event.target.checked);
        }} />
        <p>Full Time</p> <br />
      </div>
      <div className="filter-options">
        <input name="part-time" type="checkbox" checked={employmentTypePT} onChange={event => {
          onSetEmploymentTypePT(event.target.checked);
        }} />
        <p>Part Time</p> <br />
      </div>
      <div className="filter-options">
        <input name="full-time" type="checkbox" checked={employmentTypeUnspecified} onChange={event => {
          // onSetEmploymentTypeFT(event.target.checked);
        }} />
        <p>Unspecified</p>
      </div>
    </div>
  </div>
</aside>)

export default JobFilters;
