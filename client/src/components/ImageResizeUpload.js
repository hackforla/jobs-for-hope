import React from "react";
import * as s3Service from "../services/s3-service";
import * as config from "../config";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const MAX_HEIGHT = 240;

class ImageResizeUpload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      srcFile: null,
      srcDataURL: null,
      fileKey: "",
      fileType: "",
      maxHeight: props.maxHeight,
      maxWidth: props.maxWidth,
      maxBytes: props.maxBytes,
      showPreview: false
    };
    this.fileInput = React.createRef();
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    this.setState({ fileKey: this.props.fileKey || "" });
  }

  // User presses "Change Logo" button
  handleChangeLogo = e => {
    if (this.fileInput) {
      this.fileInput.current.click();
    }
  };

  // file input changes when user selects a file
  // This sets state to load the cropper with it's source file
  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      //  svg files do not need to be scaled
      this.setState({ srcFile: e.target.files[0] });
      const reader = new FileReader();
      const fileType = e.target.files[0].type;
      reader.addEventListener("load", () =>
        this.setState({ srcDataURL: reader.result, fileType }, this.resizeImage)
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  resizeImage = () => {
    const image = new Image();
    const canvasRef = this.canvasRef;
    const { maxHeight, maxWidth } = this.state;
    if (canvasRef) {
      image.onload = function() {
        const canvas = canvasRef.current;
        const heightScale = maxHeight / image.height;
        const widthScale = maxWidth / image.width;
        // Only scale if image is too large - don't try to
        // make small images larger, as the result is not good.
        const scale = Math.min(Math.min(heightScale, widthScale), 1.0);
        image.width *= scale;
        image.height *= scale;
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, image.width, image.height);
      };
      image.src = this.state.srcDataURL;
      this.setState({ showPreview: true });
    }
  };

  handleCancel = e => {
    this.setState({ srcFile: null, fileType: "" });
  };

  deleteOldFile = key => {
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
  };

  handleUpload = e => {
    e.preventDefault();
    if (this.state.fileType.includes("svg")) {
      if (this.state.fileKey) {
        this.deleteOldFile(this.state.fileKey);
      }

      try {
        s3Service.uploadFile(this.state.srcFile).then(key => {
          this.setState({ fileKey: key, showPreview: false });
          if (this.props.updateEntity) {
            // Caller supplies callback fn for updating entity with file key
            this.props.updateEntity(key);
            this.setState({ fileType: "", fileType: "", srcFile: null });
          }
        });
      } catch (err) {
        console.log(JSON.stringify(err, null, 2));
      }
    } else {
      this.canvasRef.current.toBlob(
        blob => {
          if (this.state.fileKey) {
            this.deleteOldFile(this.state.fileKey);
          }

          try {
            s3Service.uploadBlob(blob).then(key => {
              this.setState({ fileKey: key, showPreview: false });
              if (this.props.updateEntity) {
                // Caller supplies callback fn for updating entity with file key
                this.props.updateEntity(key);
                this.setState({ fileType: "", fileType: "", srcFile: null });
              }
            });
          } catch (err) {
            console.log(JSON.stringify(err, null, 2));
          }
        },
        this.state.fileType,
        0.95
      );
    }
  };

  render() {
    const { src, crop, croppedImageUrl } = this.state;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          borderTop: "1px solid gray",
          padding: "1em",
          width: "100%"
        }}
      >
        {this.state.fileKey ? (
          <div>
            <img
              style={{
                maxHeight: this.props.maxHeight,
                maxWidth: this.props.maxWidth
              }}
              src={
                this.state.fileKey
                  ? config.AWS_S3_PREFIX + this.state.fileKey
                  : ""
              }
              alt="Current Logo"
            />
          </div>
        ) : null}
        <div>
          <input
            type="file"
            style={{ display: "none" }}
            ref={this.fileInput}
            onChange={this.onSelectFile}
          />
          <button
            type="button"
            class="submit-btn"
            onClick={this.handleChangeLogo}
          >
            Change Logo...
          </button>
          <div
            style={{ display: this.state.showPreview ? "display" : "hidden" }}
          >
            {this.state.srcFile ? (
              <React.Fragment>
                <div>Replace With:</div>
                <canvas
                  id="canvas"
                  ref={this.canvasRef}
                  height={this.props.maxHeight}
                  width={this.props.maxwidth}
                />
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <button
                    type="button"
                    class="cancel-btn"
                    onClick={this.handleCancel}
                  >
                    Cancel Logo Change
                  </button>
                  <button
                    type="button"
                    class="submit-btn"
                    onClick={this.handleUpload}
                  >
                    Save Logo Change
                  </button>
                </div>
              </React.Fragment>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default ImageResizeUpload;
