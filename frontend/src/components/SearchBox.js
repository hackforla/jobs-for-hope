import React from "react";
import "./SearchBox.scss";

const SearchBox = ({
  onSearchChange,
  onZipSearchChange,
  organizations,
  onSetOrganization
}) => {
  return (
    <section role="search" className="search-container">
      <h1> Join the fight against homelessness in Los Angeles</h1>
      <form className="search">
        <div className="keyword-search">
          <div className="search-words-title">
            <h3> Housing/Homeless Jobs</h3>
          </div>
          <div className="search-words-container">
            <input
              type="search"
              className="search-input"
              name="keywords"
              placeholder="Job Title"
              onChange={onSearchChange}
            />
          </div>
        </div>
        <div className="location-search">
          <div className="search-words-title">
            <h3> Location</h3>
          </div>
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

        <div className="organization-search">
          <div className="search-words-title">
            <h3> Organization</h3>
          </div>
          <div className="location-container">
            <select
              onChange={event => {
                onSetOrganization(event);
              }}
              className="organization-input"
            >
              <option value="">(Any)</option>

              {organizations &&
                organizations.map(org => {
                  return <option value={org.id}>{org.name}</option>;
                })}
            </select>
          </div>
        </div>
      </form>
    </section>
  );
};

export default SearchBox;
