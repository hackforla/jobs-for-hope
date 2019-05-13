import React from "react";
import * as s3Service from "../services/s3-service";
import axios from "axios";
const uuidv4 = require("uuid/v4");

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
      const key = uuidv4() + file.name;

      s3Service
        .generatePresignedUrl(key, file.type)
        .then(resp => {
          console.log(JSON.stringify(resp, null, 2));
          axios
            .put(resp.urls[0], file, {
              headers: {
                "Content-Type": file.type,
                withCredentials: false
              }
            })
            .then(r => {
              if (this.props.updateEntity) {
                // Caller supplies callback fn for updating entity with file key
                this.props.updateEntity(key);
              }
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
