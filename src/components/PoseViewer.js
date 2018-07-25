import React, {Component} from 'react';
import PropTypes from 'prop-types';

const Points = {
  nose: 'red',
  leftEye: 'blue',
  rightEye: 'blue',
  leftEar: 'green',
  rightEar: 'green',
  leftShoulder: 'yellow',
  rightShoulder: 'yellow',
  leftElbow: 'purple',
  rightElbow: 'purple',
  leftWrist: 'purple',
  rightWrist: 'purple',
  leftHip: 'purple',
  rightHip: 'purple',
  leftKnee: 'purple',
  rightKnee: 'purple',
  leftAnkle: 'purple',
  rightAnkle: 'purple',
};

const Lines = [
  // TORSO
  {start: 'leftShoulder', end: 'rightShoulder', color: 'orange'},
  {start: 'leftShoulder', end: 'leftHip', color: 'orange'},
  {start: 'rightShoulder', end: 'rightHip', color: 'orange'},
  {start: 'rightHip', end: 'leftHip', color: 'orange'},

  // LEFT ARM
  {start: 'leftShoulder', end: 'leftElbow', color: 'green'},
  {start: 'leftElbow', end: 'leftWrist', color: 'green'},

  // RIGHT ARM
  {start: 'rightShoulder', end: 'rightElbow', color: 'red'},
  {start: 'rightElbow', end: 'rightWrist', color: 'red'},

  // LEFT LEG
  {start: 'leftHip', end: 'leftKnee', color: 'yellow'},
  {start: 'leftKnee', end: 'leftAnkle', color: 'yellow'},

  // RIGHT LEG
  {start: 'rightHip', end: 'rightKnee', color: 'purple'},
  {start: 'rightKnee', end: 'rightAnkle', color: 'purple'},
];

class PoseViewer extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    pose: PropTypes.object,
    color: PropTypes.string,
    opacity: PropTypes.number,
  };

  constructor(props) {
    super(props);
  }
  drawLines() {
    const pose = this.props.pose;
    return Lines.map(part => {
      if (pose[part.start] && pose[part.end]) {
        if(pose[part.start].score > 0.7 && pose[part.end].score > 0.7){
          const startCoord = pose[part.start].position;
          const endCoord = pose[part.end].position;
          const color = this.props.color ? this.props.color : part.color;
          const opacity = this.props.opacity ? this.props.opacity : 1;
          return (
            <line
              x1={startCoord.x}
              x2={endCoord.x}
              y1={startCoord.y}
              y2={endCoord.y}
              stroke={color}
              strokeWidth={2}
              opacity={opacity}
              key={`line_${part.start}_${part.end}`}
            />
          );
        }
      }
    });
  }
  drawPoints() {
    const pose = this.props.pose;
    return Object.keys(Points).map((part, color) => {
      if (pose[part] && pose[part].score> 0.7) {
        const color = this.props.color ? this.props.color : color;
        const opacity = this.props.opacity ? this.props.opacity : 1;
        const pos = pose[part].position;
        return (
          <circle
            cx={pos.x}
            cy={pos.y}
            r={5}
            fill={color}
            opacity={opacity}
            key={`point_${part}`}
          />
        );
      }
    });
  }
  render() {
    if (!this.props.pose) {
      return null;
    }

    return (
      <svg style={this.props.style}>
        {this.drawPoints()}
        {this.drawLines()}
        { this.props.centroid ?
          <circle
            cx={this.props.centroid.x}
            cy={this.props.centroid.y}
            r={10}
            fill='red'
            opacity={1}
            key = 'centroid'
          />
          : ''
        }
      </svg>
    );
  }
}

export default PoseViewer;
