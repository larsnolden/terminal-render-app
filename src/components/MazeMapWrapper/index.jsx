import * as React from "react";
import styles from "./mapwrapper.css";

export class MazeMapWrapper extends React.Component {
  componentDidMount() {
    this.props.map.on("resize", this._onResize);
    this._onResize();
  }

  componentWillUnmount() {
    this.props.map.off("resize", this._onResize);
  }

  _onResize = () => {
    this._updateZLevelControlHeight();
  };

  _updateZLevelControlHeight() {
    // Update the zLevelControl maxHeight, if it exists
    const map = this.props.map;

    if (map.zLevelControl) {
      var height = map.getCanvas().clientHeight;
      var maxHeight = height - 50; // 50 pixels account for margins and spacing
      map.zLevelControl.setMaxHeight(maxHeight);
    }
  }

  render() {
    if (!this.props.map) {
      return null;
    }

    return (
      <div
        ref={(ref) => {
          ref && ref.appendChild(this.props.map.getContainer());
          this.props.map.resize();
        }}
        className="mazemapWrapper"
      >
        {" "}
        {this.props.children}
      </div>
    );
  }
}
