import React from "react";
import * as s3Service from "../services/s3-service";
import * as config from "../config";

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);

    this.state = { fileKey: "" };
    this.fileInput = React.createRef();
  }

  componentDidMount() {
    this.setState({ fileKey: this.props.fileKey || "" });
  }

  handleUpload = e => {
    e.preventDefault();
    if (
      this.fileInput.current.files &&
      this.fileInput.current.files.length > 0
    ) {
      const file = this.fileInput.current.files[0];

      if (this.state.fileKey) {
        try {
          s3Service.deleteFile(this.state.fileKey).then(() => {
            this.setState({ fileKey: "" });
            if (this.props.updateEntity) {
              // Caller supplies callback fn for updating entity with file key
              this.props.updateEntity("");
            }
          });
        } catch (err) {
          console.log(JSON.stringify(err, null, 2));
        }
      }

      try {
        s3Service.uploadFile(file).then(key => {
          this.setState({ fileKey: key });
          if (this.props.updateEntity) {
            // Caller supplies callback fn for updating entity with file key
            this.props.updateEntity(key);
          }
        });
      } catch (err) {
        console.log(JSON.stringify(err, null, 2));
      }

      // s3Service
      //   .generatePresignedUrl(key, file.type)
      //   .then(resp => {
      //     console.log(JSON.stringify(resp, null, 2));
      //     axios
      //       .put(resp.urls[0], file, {
      //         headers: {
      //           "Content-Type": file.type,
      //           withCredentials: false
      //         }
      //       })
      //       .then(r => {
      //         this.setState({ fileKey: key });
      //         if (this.props.updateEntity) {
      //           // Caller supplies callback fn for updating entity with file key
      //           this.props.updateEntity(key);
      //         }
      //         console.log(`File ${file.name} uploaded`);
      //       });
      //   })
      //   .catch(err => {
      //     console.error(JSON.stringify(err, null, 2));
      //   });
    }
  };

  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          border: "1px solid gray",
          padding: "1em",
          width: "50%"
        }}
      >
        {this.state.fileKey ? (
          <img
            width="25%"
            src={
              this.state.fileKey
                ? config.AWS_S3_PREFIX + this.state.fileKey
                : ""
            }
            alt="Current Logo"
          />
        ) : null}
        <div>
          <input type="file" ref={this.fileInput} />
          <button type="button" onClick={this.handleUpload}>
            Upload
          </button>
        </div>
      </div>
    );
  }
}

export default ImageUpload;
