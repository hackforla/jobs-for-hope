import axios from "axios";

// retrieve jobs from database
export const getAll = () => {
	return axios.get("/api/jobs").then(result => result.data);
};

// post user-created job
export const postJob = jobInfo => {
	return axios
		.post("/api/jobs/add", {
			jobInfo
		})
		.then(result => result.data);
};
