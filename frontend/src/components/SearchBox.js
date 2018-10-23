import React from 'react';

const SearchBox = (props) => {
  return (
  <input
  type='search'
  placeholder='yay'
  onChange={props.searchChange} />
  )
}


export default SearchBox;