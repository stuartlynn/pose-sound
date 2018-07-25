import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Sound from 'react-sound';


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
    const position = this.props.position

    return this.props.sounds.map((s, index) => {
      const active = position < s.end  && position > s.start
      const volume =  active && s.on ? s.volume: 0;
      return (
        <Sound
          url={'/sounds/'+s.url}
          key={s.name}
          playStatus={this.props.playing ? Sound.status.PLAYING : Sound.status.PAUSED}
          loop={true}
          volume={volume}
        />
      )
    });
  }
}

export default SoundBoard;
