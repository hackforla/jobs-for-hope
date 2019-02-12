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
  // CHANGE_DISTANCE_OVER50,
  SHOW_MODAL,
  HIDE_MODAL
} from './constants.js'

// job searchfield reducer
const initialStateSearch = {
  searchField: '',
  zipcode: ''
}

export const searchJobListing = (state = initialStateSearch, action = {}) => {
  switch (action.type) {
    case CHANGE_SEARCHFIELD:
      return Object.assign({}, state, {
        searchField: action.payload
      })
    case CHANGE_SEARCH_ZIPCODE:
      return Object.assign({}, state, {
        zipcode: action.payload
      })
    default:
      return state
  }
}

// new jobs reducer
const initialStateJobs = {
  isPending: false,
  jobData: [],
  isError: false
}

export const requestJobs = (state = initialStateJobs, action = {}) => {
  switch (action.type) {
    case FETCH_JOBS_PENDING:
      return Object.assign({}, state, {
        isPending: true
      })
    case FETCHED_JOBS_SUCCESS:
      return Object.assign({}, state, {
        jobData: action.payload,
        isPending: false
      })

    case FETCHED_JOBS_FAILED:
      return Object.assign({}, state, {
        isError: action.payload
      })
    default:
      return state
  }
}

// organizations reducer
const initialStateOrganizations = {
  orgsArePending: false,
  organizationData: [],
  orgsGetDataError: false
}

export const requestOrgs = (state = initialStateOrganizations, action = {}) => {
  switch (action.type) {
    case FETCH_ORGANIZATIONS_PENDING:
      return Object.assign({}, state, {
        orgsArePending: true
      })
    case FETCHED_ORGANIZATIONS_SUCCESS:
      return Object.assign({}, state, {
        organizationData: action.orgPayload,
        orgsArePending: false
      })

    case FETCHED_ORGANIZATIONS_FAILED:
      return Object.assign({}, state, {
        orgsGetDataError: action.orgPayload
      })
    default:
      return state
  }
}

const initialEmployType = {
  FT: false,
  PT: false
}

export const changeEmploymentType = (state = initialEmployType, action = {}) => {
  switch (action.type) {
    case CHANGE_EMPLOYMENT_TYPE_FT:
      return Object.assign({}, state, {
        FT: !state.FT
      })
    case CHANGE_EMPLOYMENT_TYPE_PT:
      return Object.assign({}, state, {
        PT: !state.PT
      })
    default:
      return state
  }
}

const initialDistance = {
  distance: ''
}

export const changeDistance = (state = initialDistance, action = {}) => {
  switch (action.type) {
    case CHANGE_DISTANCE:
      return Object.assign({}, state, {
        distance: action.payload
      })
      // case CHANGE_DISTANCE_25:
      //   return Object.assign({}, state, {
      //     distance: 25
      // });
      // case CHANGE_DISTANCE_OVER50:
      //   return Object.assign({}, state, {
      //     distance: 1000
      // });
    default:
      return state
  }
}

const initialModalState = {
  visibility: false,
  content: null
}

export const changeModal = (state = initialModalState, action) => {
  switch (action.type) {
    case SHOW_MODAL:
      return Object.assign({}, state, {
        visibility: action.visibility,
        content: action.content
      })
    case HIDE_MODAL:
      return Object.assign({}, state, {
        visibility: action.visibility,
        content: null
      })
    default:
      return state
  }
}
