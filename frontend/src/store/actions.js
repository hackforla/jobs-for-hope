import {
  CHANGE_SEARCHFIELD,
  CHANGE_SEARCH_ZIPCODE,
  FETCH_JOBS_PENDING,
  FETCHED_JOBS_SUCCESS,
  FETCHED_JOBS_FAILED,
  FETCH_ORGANIZATIONS_PENDING,
  FETCHED_ORGANIZATIONS_SUCCESS,
  FETCHED_ORGANIZATIONS_FAILED
} from './constants.js';

export const setSearchField = text => {
  return {
    type: CHANGE_SEARCHFIELD,
    payload: text
  }
}

export const setSearchZip = text => {
  return {
    type: CHANGE_SEARCH_ZIPCODE,
    payload: text
  }
}

//retrieve jobs from database
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

//retrieve organizations' info from database
export const fetchOrganizations = () => (dispatch) => {
  dispatch({ type: FETCH_ORGANIZATIONS_PENDING });

  const url = "https://spreadsheets.google.com/feeds/list/16npDyyzNjgZ2h5uZmRNs2T2RRUCJtHB_1eHpmxUr1SI/3/public/values?alt=json"

  fetch(url)
        .then(response => response.json())
        .then(res => console.log(res))
        .then( data => dispatch({
          type: FETCHED_ORGANIZATIONS_SUCCESS,
          payload: data.feed.entry
        }))
        .catch(error => dispatch({
          type:FETCHED_ORGANIZATIONS_FAILED,
          payload: error
        }))
}