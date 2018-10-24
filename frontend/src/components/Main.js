import React from 'react';
import SearchBox from './SearchBox';

const Main = ({ onSearchChange }) => (
  <div>
    <h1>Main page</h1>
    <SearchBox
      onSearchChange={onSearchChange}
    />
  </div>
);

export default Main;

  // <Searchbar />
  // <Job Posting />
  // <SearchByFilter />