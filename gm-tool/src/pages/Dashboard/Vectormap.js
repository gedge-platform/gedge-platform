import React, { Component } from "react";
import { VectorMap } from "react-jvectormap";
import "./jquery-jvectormap.css";

export class Vectormap extends Component {
  render() {
    return (
      <div style={{ width: this.props.width, height: 250 }}>
        <VectorMap
          map={this.props.value}
          backgroundColor="transparent"
          ref="map"
          containerStyle={{
            width: "100%",
            height: "80%"
          }}
          regionStyle={{
            initial: {
              fill: this.props.color,
              stroke: "#74788d",
              "stroke-width": 1,
              "stroke-opacity": 0.4
            },
            hover: {
              "fill-opacity": 0.8,
              cursor: "pointer"
            },
            selected: {
              fill: "#2938bc" //what colour clicked country will be
            },
            selectedHover: {}
          }}
          containerClassName="map"
        />
      </div>
    );
  }
}

export default Vectormap;
