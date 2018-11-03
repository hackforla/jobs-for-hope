import {
  CHANGE_SEARCHFIELD,
  CHANGE_SEARCH_ZIPCODE,
  FETCH_JOBS_PENDING,
  FETCHED_JOBS_SUCCESS,
  FETCHED_JOBS_FAILED,
} from './constants.js';

const initialStateSearch = {
  searchField: '',
  zipcode: '',

};

export const searchJobListing = (state = initialStateSearch, action = {}) => {
  switch (action.type) {
    // case CHANGE_SEARCHFIELD && CHANGE_SEARCH_ZIPCODE:
    //   return Object.assign({}, state, {
    //     searchField: action.payload,
    //     zipcode: action.payload
    //   });
    case CHANGE_SEARCHFIELD:
      return Object.assign({}, state, {
        searchField: action.payload,
      });
    case CHANGE_SEARCH_ZIPCODE:
      return Object.assign({}, state, {
        zipcode: action.payload,
      });
    default:
      return state;
  }
}

const initialStateJobs = {
  isPending: false,
  jobData: [],
  isError: false
};

//new jobs reducer
export const requestJobs = (state = initialStateJobs, action = {}) => {
  switch (action.type) {
    case FETCH_JOBS_PENDING:
      return Object.assign({}, state, {
        isPending: true,
      });
    case FETCHED_JOBS_SUCCESS:
      return Object.assign({}, state, {
        jobData: action.payload,
        isPending: false,
      });

    case FETCHED_JOBS_FAILED:
      return Object.assign({}, state, {
        isError: action.payload,
      });
    default:
      return state;
  }
}
