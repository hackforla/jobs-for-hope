const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  //signatureVersion: "v4",
  region: "us-west-2"
});

const express = require("express");

const router = express.Router();

router.post("/generatePresignedUrl", (req, res) => {
  const key = req.body.key;
  const contentType = req.body.contentType || "image/png";
  const timeout = 60 * 60;
  const fileUrls = [];

  const bucket = process.env.AWS_BUCKET;

  const params = {
    Bucket: bucket,
    Key: key,
    Expires: timeout,
    ACL: "bucket-owner-full-control",
    ContentType: contentType
  };

  s3.getSignedUrl("putObject", params, function(err, url) {
    if (err) {
      console.log("Error getting presigned url from AWS S3");
      res.json({
        success: false,
        message: "Presigned URL error",
        urls: fileUrls
      });
    } else {
      fileUrls[0] = url;
      console.log("Presigned URL: ", fileUrls[0]);
      res.json({
        success: true,
        message: "AWS SDK S3 Pre-signed urls generated successfully.",
        urls: fileUrls
      });
    }
  });
});

module.exports = router;
