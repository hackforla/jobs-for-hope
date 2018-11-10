import React from 'react';

const SideFilter = () => {
  return (
        <aside class="filter-bar-container">
            <b><p id="filters-title"> FILTERS</p></b>
            <div class="distance filter-criteria">
                <p> Distance</p>
                <select class="distance-selector">
                    <option>10 miles</option>
                    <option>25 miles</option>
                    <option>50 miles</option>
                    <option>50+ miles</option>
                </select>
            </div>
            <div class="employment-type filter-criteria">
                <p>Employment Type</p>
                <div class="filter-options">
                    <input name="full-time" type="checkbox" />
                    <p> Full Time (14)</p> <br />
                </div>
                <div class="filter-options">
                    <input name="part-time" type="checkbox" />
                    <p> Part Time (14)</p> <br />
                </div>
            </div>
            <div class="department-type filter-criteria">
                <p> Department Type</p>
                <div class="filter-options">
                    <input name="housing" type="checkbox" />
                    <p> Housing (14)</p> <br />
                </div>
                <div class="filter-options">
                    <input name="management" type="checkbox" />
                    <p> Management (14)</p> <br />
                </div>
                <div class="filter-options">
                    <input name="operations" type="checkbox" />
                    <p> Operations (14)</p> <br />
                </div>
                <div class="filter-options">
                    <input name="accounting" type="checkbox" />
                    <p> Accounting (14)</p> <br />
                </div>
                <div class="filter-options">
                    <input name="human-resources" type="checkbox" />
                    <p> Human Resources (14)</p> <br />
                </div>
            </div>
            <div class="experience-level filter-criteria">
                <p> Experience Level</p>
                <div class="filter-options">
                    <input name="entry-level" type="checkbox" />
                    <p> Entry Level (14)</p> <br />
                </div>
                <div class="filter-options">
                    <input name="mid-level" type="checkbox" />
                    <p> Mid Level (14)</p> <br />
                </div>
                <div class="filter-options">
                    <input name="senior-level" type="checkbox" />
                    <p> Senior Level (14)</p> <br />
                </div>
            </div>
        </aside>

  )
}

export default SideFilter;