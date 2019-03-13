import axios from "axios";

// retrieve jobs from database
export const getAll = () => {
  return axios.get("/api/orgs").then(result => result.data);
};
