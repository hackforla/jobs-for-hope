import {
  CHANGE_SEARCHFIELD,
  CHANGE_SEARCH_ZIPCODE,
  FETCH_JOBS_PENDING,
  FETCHED_JOBS_SUCCESS,
  FETCHED_JOBS_FAILED
} from './constants.js';

export const setSearchField = text => {
  // console.log(text);
  return {
    type: CHANGE_SEARCHFIELD,
    payload: text
  }
}

export const setSearchZip = text => {
  console.log(text);
  return {
    type: CHANGE_SEARCH_ZIPCODE,
    payload: text
  }
}

export const fetchJobs = () => (dispatch) => {
  dispatch({ type: FETCH_JOBS_PENDING });

  const url = "https://spreadsheets.google.com/feeds/list/16npDyyzNjgZ2h5uZmRNs2T2RRUCJtHB_1eHpmxUr1SI/od6/public/values?alt=json"

  fetch(url)
        .then(response => response.json())
        .then( data => dispatch({
          type: FETCHED_JOBS_SUCCESS,
          payload: data.feed.entry
        }))
        .catch(error => dispatch({
          type:FETCHED_JOBS_FAILED,
          payload: error
        }))
}