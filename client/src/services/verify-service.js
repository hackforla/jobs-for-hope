import axios from "axios";

export const loadRequests = () => {
	return axios({
	  method: 'get',
	  url: '/verify/',
	  baseURL: 'http://localhost:5000/api/',
	}).then(res => res.data.rows)
}

export const approveRequest = (email) => {
	return axios({
	  method: 'post',
	  url: '/verify/approve',
	  baseURL: 'http://localhost:5000/api/',
	  data: {
	    email
	  }
	}).then(res => res.data) 
}