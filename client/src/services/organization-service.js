import axios from "axios";

// retrieve jobs from database
export const getAll = () => {
  return axios.get("/api/orgs").then(result => result.data);
};

export const get = id => {
  return axios
    .get("/api/orgs/" + id.toString())
    .then(response => response.data);
};

export const post = req => {
  req.regionids =
    req.regions && req.regions.map(region => parseInt(region.value));
  return axios.post("/api/orgs", req).then(response => response.data);
};

export const put = req => {
  req.regionids =
    req.regions && req.regions.map(region => parseInt(region.value));
  return axios
    .put("/api/orgs/" + req.id.toString(), req)
    .then(response => response.data);
};

export const del = id => {
  return axios
    .delete("/api/orgs/" + id.toString())
    .then(response => response.data);
};

export const updateFileKey = (id, oldFileKey, newFileKey) => {
  return axios
    .put("/api/orgs/" + id.toString() + "/updateFileKey", {
      id,
      oldFileKey,
      newFileKey
    })
    .then(resp => resp.data);
};
