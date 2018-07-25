import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Sound from 'react-sound';
import * as d3 from 'd3';

class SoundBoard extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.updateTime = this.updateTime.bind(this);
  }

  updateTime(update) {
    this.setState({
      position: update.position,
    });
  }

  render() {
    const position = this.props.position;
    return this.props.sounds.map((s, index) => {
      const ramp = d3
        .scaleLinear()
        .domain([s.fadeInStart, s.start, s.end, s.fadeOutEnd])
        .range([0, s.volume, s.volume, 0]);

      const volume = s.on ?  ramp(position) : 0 ;

      return (
        <Sound
          url={'/sounds/' + s.url}
          key={s.name}
          playStatus={
            this.props.playing ? Sound.status.PLAYING : Sound.status.PAUSED
          }
          loop={true}
          volume={volume}
        />
      );
    });
  }
}

export default SoundBoard;
