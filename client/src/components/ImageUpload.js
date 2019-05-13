import React from "react";
import * as s3Service from "../services/s3-service";
import axios from "axios";

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
  }

  handleUpload = e => {
    e.preventDefault();
    if (
      this.fileInput.current.files &&
      this.fileInput.current.files.length > 0
    ) {
      const file = this.fileInput.current.files[0];

      s3Service
        .generatePresignedUrl(file.name, file.type)
        .then(resp => {
          console.log(JSON.stringify(resp, null, 2));
          axios
            .post(resp.urls[0], file, {
              headers: {
                "Content-Type": file.type,
                withCredentials: true
              }
            })
            .then(r => {
              console.log(`File ${file.name} uploaded`);
            });
        })
        .catch(err => {
          console.error(JSON.stringify(err, null, 2));
        });
    }
  };

  render() {
    return (
      <div>
        <input type="file" ref={this.fileInput} />
        <button type="button" onClick={this.handleUpload}>
          Upload
        </button>
      </div>
    );
  }
}

export default ImageUpload;
