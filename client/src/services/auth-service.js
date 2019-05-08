import axios from "axios";

axios.defaults.withCredentials = true;

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

export const handleNewOrg = (
	orgName,
	website,
	contactEmail,
	contactPhone,
	email,
	password,
	confirm
) => {
	return axios
		.post("/api/auth/register/new-org", {
			orgName,
			website,
			contactEmail,
			contactPhone,
			email,
			password,
			confirm
		})
		.then(res => res.data);
};

export const handleLogOut = (email, password) => {
  return axios.get("/api/auth/logout").then(result => result.data);
};

export const sendConfirmEmail = email => {
  return axios.post("/api/auth/send-confirm", { email }).then(res => res.data);
};

export const sendResetEmail = email => {
  return axios.post("/api/auth/send-reset", { email }).then(res => res.data);
};

export const submitReset = (userid, password) => {
  return axios
    .post("/api/auth/submit-reset", { userid, password })
    .then(res => res.data);
};
