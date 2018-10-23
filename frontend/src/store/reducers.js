import { CHANGE_SEARCHFIELD } from './constants.js';

const initialState = {
  searchField: ''
};

//needs state and action parameters
const searchJobListing = (state = initialState, action = {}) => {
  switch (action.type) {
    case CHANGE_SEARCHFIELD:
      return Object.assign({}, state, { searchField: action.payload })
    default:
      return state;
  }
}

export default searchJobListing;