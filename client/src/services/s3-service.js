import axios from "axios";

export const generatePresignedUrl = (key, contentType) => {
  return axios
    .post("/api/s3/generatepresignedurl", {
      key,
      contentType: contentType || "image/png"
    })
    .then(result => result.data);
};

export const upload = (key, file, contentType) => {
  return generatePresignedUrl(key, contentType)
    .then(resp => {
      return axios.post(resp.url, file);
    })
    .then(resp => resp.data);
};
