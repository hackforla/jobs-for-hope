import React from 'react';

const SearchBox = ({ searchChange }) => {
  return (
  <input
  type='search'
  placeholder='yay'
  onChange={searchChange} />
  )
}


export default SearchBox;