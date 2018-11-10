import React from 'react';

import './SideFilter.scss'

const SideFilter = () => {
  return (
        <aside className="filter-bar-container">
            <b><p id="filters-title"> FILTERS</p></b>
            <div className="distance filter-criteria">
                <p> Distance</p>
                <select className="distance-selector">
                    <option>10 miles</option>
                    <option>25 miles</option>
                    <option>50+ miles</option>
                </select>
            </div>
            <div className="employment-type filter-criteria">
                <p>Employment Type</p>
                <div className="filter-options">
                    <input name="full-time" type="checkbox" />
                    <p> Full Time (14)</p> <br />
                </div>
                <div className="filter-options">
                    <input name="part-time" type="checkbox" />
                    <p> Part Time (14)</p> <br />
                </div>
            </div>
            <div className="department-type filter-criteria">
                <p> Department Type</p>
                <div className="filter-options">
                    <input name="housing" type="checkbox" />
                    <p> Housing (14)</p> <br />
                </div>
                <div className="filter-options">
                    <input name="management" type="checkbox" />
                    <p> Management (14)</p> <br />
                </div>
                <div className="filter-options">
                    <input name="operations" type="checkbox" />
                    <p> Operations (14)</p> <br />
                </div>
                <div className="filter-options">
                    <input name="accounting" type="checkbox" />
                    <p> Accounting (14)</p> <br />
                </div>
                <div className="filter-options">
                    <input name="human-resources" type="checkbox" />
                    <p> Human Resources (14)</p> <br />
                </div>
            </div>
            <div className="experience-level filter-criteria">
                <p> Experience Level</p>
                <div className="filter-options">
                    <input name="entry-level" type="checkbox" />
                    <p> Entry Level (14)</p> <br />
                </div>
                <div className="filter-options">
                    <input name="mid-level" type="checkbox" />
                    <p> Mid Level (14)</p> <br />
                </div>
                <div className="filter-options">
                    <input name="senior-level" type="checkbox" />
                    <p> Senior Level (14)</p> <br />
                </div>
            </div>
        </aside>

  )
}

export default SideFilter;