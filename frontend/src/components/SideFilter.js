import React from 'react';

import './SideFilter.scss'

const SideFilter = ({ onSetEmploymentTypeFT, onSetEmploymentTypePT }) => {
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
                    <input name="full-time" type="checkbox" onChange={event => onSetEmploymentTypeFT(event)} />
                    <p>Full Time</p> <br />
                </div>
                <div className="filter-options">
                    <input name="part-time" type="checkbox" onChange={event => onSetEmploymentTypePT(event)} />
                    <p>Part Time</p> <br />
                </div>
            </div>
            <div className="experience-level filter-criteria">
                <p> Experience Level</p>
                <div className="filter-options">
                    <input name="entry-level" type="checkbox" />
                    <p>Entry Level</p> <br />
                </div>
                <div className="filter-options">
                    <input name="mid-level" type="checkbox" />
                    <p>Mid Level</p> <br />
                </div>
                <div className="filter-options">
                    <input name="senior-level" type="checkbox" />
                    <p>Senior Level</p> <br />
                </div>
            </div>
        </aside>

  )
}

export default SideFilter;