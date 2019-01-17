import axios from 'axios';
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
  SHOW_MODAL,
  HIDE_MODAL,
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

  axios
    .get("/jobs")
    .then(res =>
      dispatch({
        type: FETCHED_JOBS_SUCCESS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: FETCHED_JOBS_FAILED,
        payload: err
      })
);
}

//retrieve organizations' info from database
export const fetchOrganizations = () => (dispatch) => {
  dispatch({ type: FETCH_ORGANIZATIONS_PENDING });

  axios
    .get("/orgs")
    .then(res =>
      dispatch({
        type: FETCHED_ORGANIZATIONS_SUCCESS,
        orgPayload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: FETCHED_ORGANIZATIONS_FAILED,
        orgPayload: err
      })
    );
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

export const setShowModal = (job) => ({
  type: SHOW_MODAL,
  visibility: true,
  content: job,
})

export const setHideModal = () => ({
  type: HIDE_MODAL,
  visibility: false,
  content: null,
})
