import axios from "axios";

export const loadRequests = () => {
	return axios.get("/api/verify/").then(result => result.data.rows);
};

export const approveRequest = email => {
	return axios.post("/api/verify/approve", { email }).then(res => res.data);
};

export const sendConfirmEmail = email => {
	return axios
		.post("/api/verify/send-confirm", { email })
		.then(res => res.data);
};
