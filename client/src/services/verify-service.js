import axios from "axios";

export const loadRequests = () => {
	return axios.get("/api/verify/")
  			  .then(result => result.data);
}

export const approveRequest = (email) => {
	return axios.post("/api/verify/approve", { email })
				.then(res => res.data);
}