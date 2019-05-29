import React from "react";
import Select from "react-select";

class SelectRegion extends React.Component {
  handleChange = value => {
    this.props.onChange("regions", value);
  };

  handleBlue = () => {
    this.props.onBlur("regions", true);
  };

  options = [
    { value: "1", label: "South Bay" },
    { value: "2", label: "South Los Angeles" },
    { value: "3", label: "Antelope Valley" },
    { value: "4", label: "East and Southeast Los Angeles" },
    { value: "5", label: "Metro Los Angeles" },
    { value: "6", label: "West Los Angeles" },
    { value: "7", label: "San Gabriel Valley" },
    { value: "8", label: "San Fernando Valley" }
  ];

  render() {
    return (
      <div style={{ margin: "1rem 0" }}>
        <label htmlFor="color">Regions (select at least 1) </label>
        <Select
          id="color"
          options={this.options}
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
