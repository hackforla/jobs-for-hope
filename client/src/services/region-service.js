import axios from "axios";

export const getAll = () => {
  return axios.get("/api/regions").then(result => result.data);
};
