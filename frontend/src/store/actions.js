import {
  CHANGE_SEARCHFIELD,
  FETCH_JOBS_PENDING,
  FETCHED_JOBS_SUCCESS,
  FETCHED_JOBS_FAILED
} from './constants.js';

export const setSearchField = text => {
  console.log(text);
  return {
    type: CHANGE_SEARCHFIELD,
    payload: text
  }
}

export const fetchJobs = () => (dispatch) => {
  dispatch({ type: FETCH_JOBS_PENDING });

  const url = "https://spreadsheets.google.com/feeds/list/16npDyyzNjgZ2h5uZmRNs2T2RRUCJtHB_1eHpmxUr1SI/od6/public/values?alt=json"

  fetch(url)
        .then(response => response.json()) //converts response to JS object & returns another promise, cuz it has to wait for body to load, so..
        .then( data => dispatch({ //FETCHED_JOBS(posts)
          type: FETCHED_JOBS_SUCCESS,
          payload: data.feed.entry
        }))
        .catch(error => dispatch({ type:FETCHED_JOBS_FAILED, payload: error }))
}

  //usually action creators return plain js object but thunk returns a fx. thunk sees its a fx and invokes fn with dispatch method. once request resolves with data finall call dispatch method with action to send to reducers.