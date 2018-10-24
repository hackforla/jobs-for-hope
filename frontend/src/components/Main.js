import React from 'react';
import SearchBox from './SearchBox';

const Main = ({ searchChange }) => (
  <div>
    <h1>Main page</h1>
    <SearchBox searchChange={searchChange} />
  </div>
);

export default Main;
  // <Searchbar />
  // <SearchByCategory />
  // <Job Posting />