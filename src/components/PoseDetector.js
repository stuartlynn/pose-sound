import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as posenet from '@tensorflow-models/posenet';
import Webcam from 'react-webcam';
import ReactAnimationFrame from 'react-animation-frame';
import PoseViewer from './PoseViewer';

class PoseDetector extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    showVis: PropTypes.boolean
  };

  constructor(props) {
    super(props);
    this.calculateSimilarity = this.calculateSimilarity.bind(this);
    this.calculatePose1Similarity = this.calculatePose1Similarity.bind(this);
    this.calculatePose2Similarity = this.calculatePose2Similarity.bind(this);
    this.calculatePose3Similarity = this.calculatePose3Similarity.bind(this);
    this.calculateCompression = this.calculateCompression.bind(this);
  }

  state = {
    videoStatus: 'loading',
    poseStatus: 'loading',
    detect: true,
    volume: 100,
    savedPoses: [],
    similarities: [],
    pose: {},
    compresion: 0,
    centroid: null,
  };

  formatPose(pose) {
    return Object.values(pose).reduce(
      (r, part) => ({...r, [part.part]: part}),
      {},
    );
  }

  calculateCompression() {
    const pose = this.state.pose;
    const significantPoints = Object.values(pose).filter(p => p.score > 0.7);

    const no = significantPoints.length;

    const centroid = significantPoints.reduce(
      (cent, part) => {
        const x = part.position.x;
        const y = part.position.y;
        cent.x += x / no;
        cent.y += y / no;
        return cent;
      },
      {x: 0, y: 0},
    );

    const compression = significantPoints.reduce((dist, part) => {
      const x = part.position.x;
      const y = part.position.y;
      return dist + Math.pow(centroid.x - x, 2) + Math.pow(centroid.y - y, 2);
    }, 0);

    this.setState({
      compression: Math.sqrt(compression)  ,
      centroid,
    });
    this.props.onCompressionChange(compression)
  }

  calculatePose1Similarity() {
    const pose = this.state.pose;
    const rightElbow = pose.rightElbow;
    const leftElbow = pose.leftElbow;
    const rightWrist = pose.rightWrist;
    const leftWrist = pose.leftWrist;
    const leftKnee = pose.leftKnee;
    const rightKnee = pose.rightKnee;

    const dist = Math.sqrt(
      Math.pow(rightElbow - leftWrist, 2) +
        Math.pow(leftElbow - rightWrist, 2) +
        Math.pow(leftElbow - leftKnee, 2) +
        Math.pow(rightElbow - rightKnee, 2),
    );
    return dist;
  }

  calculatePose2Similarity() {
    return 0;
  }

  calculatePose3Similarity() {
    return 0;
  }

  calculatePoseSimilarities() {
    return {
      pose1: this.calculatePose1Similarity(),
      pose2: this.calculatePose2Similarity(),
      pose3: this.calculatePose3Similarity(),
    };
  }

  calculateSimilarity() {
    console.log('SIMILARITIES');
    const pose = this.state.pose;
    const similarities = this.state.savedPoses.map(refPose => {
      const p = refPose;
      const dot = Object.keys(refPose).reduce((r, part) => {
        return (
          r +
          pose[part].position.x * refPose[part].position.x +
          pose[part].position.y * refPose[part].position.y
        );
      }, 0);
      const A = Object.keys(refPose).reduce((r, part) => {
        return (
          r +
          refPose[part].position.x * refPose[part].position.x +
          refPose[part].position.y * refPose[part].position.y
        );
      }, 0);
      const B = Object.keys(pose).reduce((r, part) => {
        return (
          r +
          refPose[part].position.x * refPose[part].position.x +
          refPose[part].position.y * refPose[part].position.y
        );
      }, 0);
      return dot / (Math.sqrt(A) * Math.sqrt(B));
    });
    this.props.onSimilarityChange(similarities);
    this.setState({similarities});
  }

  capturePose() {
    const newPose = JSON.parse(JSON.stringify(this.state.pose));
    this.setState({
      savedPoses: [...this.state.savedPoses, newPose],
    });
  }

  onAnimationFrame() {
    const scaleFactor = 0.5;
    const flipHorizontal = false;
    const outputStride = 16;

    if (
      this.state.videoStatus !== 'loading' &&
      this.state.poseStatus !== 'loading' &&
      this.state.detect
    ) {
      const video = this.webcam.video;
      this.net
        .estimateSinglePose(video, scaleFactor, flipHorizontal, outputStride)
        .then(results => {
          this.setState(
            {pose: this.formatPose(results.keypoints)},
            this.calculateCompression,
          );
          if (this.props.onPoseChange) {
            this.props.onPoseChange(results.keypoints);
          }
        });
      //const image  = this.webcam.
    }
  }

  handleKeyDown(e) {
    console.log('got keypress ', e);
    if (e.code === 'Space') {
      this.capturePose();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  componentWillMount() {
    posenet.load(0.75).then(net => {
      this.net = net;
      this.setState({poseStatus: 'loaded'});
    });

    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  render() {
    const width = 300
    const height = 300;
    const webcamShow = this.props.showVis ? 'block' : 'none'
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContents: 'space-between',
        }}>
        <div
          style={{
            position: 'relative',
            width: width,
            height: height,
            zIndex: 10,
          }}>
          <Webcam
            height={height}
            width={width}
            style={{
              position: 'absolute',
              width: width,
              height: height,
              textAlign: 'left',
              display: webcamShow
            }}
            ref={webcam => {
              this.webcam = webcam;
            }}
            onUserMedia={() => {
              this.setState({videoStatus: 'got feed'});
            }}
          />
          { this.props.showVis &&
            <PoseViewer
              style={{
                position: 'absolute',
                width: width,
                height: height,
                zIndex: 20,
              }}
              pose={this.state.pose}
              centroid={this.state.centroid}
            />}
        </div>
      </div>
    );
  }
}

export default ReactAnimationFrame(PoseDetector);
