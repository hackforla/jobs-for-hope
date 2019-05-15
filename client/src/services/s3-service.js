import axios from "axios";
import uuidv4 from "uuid/v4";

export const uploadFile = async file => {
  const key = uuidv4() + file.name;
  const contentType = file.type;

  // Get pre-signed url from our server
  let presignResponse = await axios.post("/api/s3/generatepresignedurl", {
    key,
    contentType: contentType || "image/png"
  });

  if (presignResponse.data.success) {
    let url = presignResponse.data.urls[0];

    // use pre-signed url to upload file to S3
    let uploadResponse = await axios.put(url, file, {
      headers: {
        "Content-Type": file.type,
        withCredentials: false
      }
    });
    return key;
  }
  return null;
};

export const deleteFile = async key => {
  // Get pre-signed url from our server
  let response = await axios.delete("/api/s3/" + key.toString());

  return response;
  // if (presignResponse.data.success) {
  //   let url = presignResponse.data.urls[0];

  //   // use pre-signed url to delete file from S3
  //   try {
  //     let uploadResponse = await axios.put(
  //       url,
  //       { Key: key },
  //       {
  //         headers: {
  //           withCredentials: false,
  //           Key: key
  //         }
  //       }
  //     );
  //     console.log(JSON.stringify(uploadResponse, null, 2));
  //   } catch (err) {
  //     console.log(JSON.stringify(err, null, 2));
  //   }
  //   return key;
  // }
  // return null;
};
