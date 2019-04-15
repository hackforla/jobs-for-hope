import axios from "axios";

axios.defaults.withCredentials = true;
// retrieve jobs from database
export const authCheck = () => {
  return axios({
	  method: 'get',
	  url: '/auth/',
	  baseURL: 'http://localhost:5000/api/',
	}).then(res => res.data)
}

export const handleLogIn = (email, password) => {
	return axios({
	  method: 'post',
	  url: '/auth/login',
	  baseURL: 'http://localhost:5000/api/',
	  data: {
	    email,
	    password
	  }
	}).then(res => res.data) 
}

export const handleRegister = (organization, email, password) => {
	return axios({
	  method: 'post',
	  url: '/auth/register',
	  baseURL: 'http://localhost:5000/api/',
	  data: {
	  	organization,
	    email,
	    password
	  }
	}).then(res => res.data)
}

export const handleLogOut = (email, password) => {
	return axios({
	  method: 'get',
	  url: '/auth/logout',
	  baseURL: 'http://localhost:5000/api/',
	}).then(res => res.data) 
}