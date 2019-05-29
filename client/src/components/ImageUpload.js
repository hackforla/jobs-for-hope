import React from "react";
import * as s3Service from "../services/s3-service";
import * as config from "../config";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fileKey: "",
      showCropper: false,
      src: null,
      crop: {
        aspect: 1,
        x: 0,
        y: 0
      },
      croppedImageBlob: null
    };
    this.fileInput = React.createRef();
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
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        this.setState({ src: reader.result })
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  onImageLoaded = (image, crop) => {
    this.imageRef = image;
  };

  onCropComplete = crop => {
    this.makeClientCrop(crop);
  };

  onCropChange = crop => {
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        "newFile.jpeg"
      );
      this.setState({ croppedImageUrl });
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        this.setState({ croppedImageBlob: blob });
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error("Canvas is empty");
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, "image/png");
    });
  }

  handleUpload = e => {
    e.preventDefault();
    if (
      this.state.croppedImageBlob
      // this.fileInput.current.files &&
      // this.fileInput.current.files.length > 0
    ) {
      //const file = this.fileInput.current.files[0];
      //const file = this.state.croppedImageUrl;

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
        s3Service.uploadBlob(this.state.croppedImageBlob).then(key => {
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
    const { src, crop, croppedImageUrl } = this.state;
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
          <input
            type="file"
            style={{ display: "none" }}
            ref={this.fileInput}
            onChange={this.onSelectFile}
          />
          <button type="button" onClick={this.handleChangeLogo}>
            Change Logo...
          </button>
          {src && (
            <div>
              <ReactCrop
                src={src}
                crop={crop}
                onImageLoaded={this.onImageLoaded}
                onComplete={this.onCropComplete}
                onChange={this.onCropChange}
              />
            </div>
          )}
          <div>
            {croppedImageUrl && (
              <img
                alt="Crop"
                style={{ maxWidth: "100%" }}
                src={croppedImageUrl}
              />
            )}
          </div>
          <button type="button" onClick={this.handleUpload}>
            Upload
          </button>
        </div>
      </div>
    );
  }
}

export default ImageUpload;
