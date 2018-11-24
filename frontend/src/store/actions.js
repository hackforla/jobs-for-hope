import {
  CHANGE_SEARCHFIELD,
  CHANGE_SEARCH_ZIPCODE,
  FETCH_JOBS_PENDING,
  FETCHED_JOBS_SUCCESS,
  FETCHED_JOBS_FAILED,
  FETCH_ORGANIZATIONS_PENDING,
  FETCHED_ORGANIZATIONS_SUCCESS,
  FETCHED_ORGANIZATIONS_FAILED,
  CHANGE_EMPLOYMENT_TYPE_FT,
  CHANGE_EMPLOYMENT_TYPE_PT,
  CHANGE_DISTANCE,
  // CHANGE_DISTANCE_25,
  // CHANGE_DISTANCE_OVER50
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
        })
        )
}

//retrieve organizations' info from database
export const fetchOrganizations = () => (dispatch) => {
  dispatch({ type: FETCH_ORGANIZATIONS_PENDING });

  const url = "https://spreadsheets.google.com/feeds/list/16npDyyzNjgZ2h5uZmRNs2T2RRUCJtHB_1eHpmxUr1SI/3/public/values?alt=json"

  fetch(url)
        .then(response => response.json())
        // .then(res => {console.log(res); return res;}) //getting org data
        .then( resp => dispatch({
          type: FETCHED_ORGANIZATIONS_SUCCESS, //not getting right info...
          orgPayload: resp.feed.entry
        })
        )
        .catch(error => dispatch({
          type:FETCHED_ORGANIZATIONS_FAILED,
          orgPayload: error
        })
        )
}

export const setEmploymentTypeFT = () => {
  return {
    type: CHANGE_EMPLOYMENT_TYPE_FT,
  }
}

export const setEmploymentTypePT = () => {
  return {
    type: CHANGE_EMPLOYMENT_TYPE_PT,
  }
}

export const setDistance = text => {
  return {
    type: CHANGE_DISTANCE,
    payload: text
  }
}

// export const setDistance25 = () => {
//   return {
//     type: CHANGE_DISTANCE_25
//   }
// }

// export const setDistanceOver50 = () => {
//   return {
//     type: CHANGE_DISTANCE_OVER50
//   }
// }