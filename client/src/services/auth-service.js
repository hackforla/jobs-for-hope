import axios from "axios";

axios.defaults.withCredentials = true;
// retrieve jobs from database
export const authCheck = () => {
	return axios.get("/api/auth/").then(result => result.data);
};

export const handleLogIn = (email, password) => {
	return axios
		.post("/api/auth/login", { email, password })
		.then(res => res.data);
};

export const handleRegister = (organization, email, password) => {
	return axios
		.post("/api/auth/register", { organization, email, password })
		.then(res => res.data);
};

export const handleLogOut = (email, password) => {
	return axios.get("/api/auth/logout").then(result => result.data);
};
