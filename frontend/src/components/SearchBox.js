import React from 'react';
import './SearchBox.scss';

const SearchBox = ({ onSearchChange, onZipSearchChange }) => {
  return (
    <section role="search" className="search-container">
      <h1> Join the fight against homelessness in Los Angeles</h1>
      <form className="search">
          <div className="keyword-search">
              <div className="search-words-title">
              <h3> Housing/Homeless Jobs</h3>
              </div>
              <div className="search-words-container">
                  <input type="search" className="search-input" name="keywords" placeholder="Job Title or Keywords" onChange={onSearchChange} />
              </div>
          </div>
          <div className="location-search">
              <div className="search-words-title">
              <h3> Location</h3>
              </div>
              <div className="location-container">
                  <input type="search" className="location-input" name="location" placeholder="City or ZIP" onChange={onZipSearchChange}/>
              </div>
          </div>
          <div className="search-btn-content-container">
              <div className="search-btn-title">
                  <h3> Explore</h3>
              </div>
              <div className="search-btn-container">
                  <button type="button" value="done" className="search-btn">Search</button>
              </div>
          </div>
      </form>
    </section>
  )
}


export default SearchBox;

