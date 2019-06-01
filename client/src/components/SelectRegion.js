import React from "react";
import Select from "react-select";
const options = require("./regions.json");

class SelectRegion extends React.Component {
  handleChange = value => {
    this.props.onChange("regions", value);
  };

  handleBlue = () => {
    this.props.onBlur("regions", true);
  };

  render() {
    return (
      <div style={{ margin: "1rem 0" }}>
        <label htmlFor="color">Regions (select at least 1) </label>
        <Select
          id="color"
          options={options}
          isMulti
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          value={this.props.value}
        />
        {!!this.props.error && this.props.touched && (
          <div style={{ color: "red", marginTop: ".5rem" }}>
            {this.props.error}
          </div>
        )}
      </div>
    );
  }
}

export default SelectRegion;
