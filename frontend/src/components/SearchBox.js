import React from 'react';

const SearchBox = ({ onSearchChange }) => {
  return (
  <input
  type='search'
  placeholder='yay'
  onChange={onSearchChange} />
  )
}


export default SearchBox;