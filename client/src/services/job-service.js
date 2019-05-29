import axios from "axios";

// retrieve jobs from database
export const getAll = () => {
	return axios.get("/api/jobs").then(result => result.data);
};

// get single job based on job id
export const getJob = id => {
	return axios.get(`/api/jobs/job/${id}`).then(result => result.data);
};

// post user-created job
export const postJob = jobInfo => {
	return axios
		.post("/api/jobs/add", {
			jobInfo
		})
		.then(result => result.data);
};

// edit user-created job
export const editJob = (jobInfo, id) => {
	return axios
		.post("/api/jobs/edit", {
			jobInfo,
			id
		})
		.then(result => result.data);
};

// delete user-created job
export const deleteJob = id => {
	return axios
		.post(`/api/jobs/delete`, {
			id
		})
		.then(result => result.data);
};
