import React from "react";
import "./Banner.scss";

const Banner = props => {
  const imageUrl = require(`../images/${props.imageName}.jpg`);
  const customStyles = props.customStyles

  return (
    <div
      className="banner"
      role="banner"
      style={{
        backgroundImage: `url(${imageUrl})`,
        customStyles
      }}
    >
      <h1 className="banner-title">
        {props.titleUpper} <br /> {props.titleLower}
      </h1>
    </div>
  );
};

// It should be taking a title and an image prop

export default Banner
