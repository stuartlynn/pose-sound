import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Slider, {Range} from 'rc-slider';
import styled from 'styled-components';
import Checkbox from 'rc-checkbox';
import 'rc-slider/assets/index.css';

const ControllsOuter = styled.div`
  width : 500px;
  heigth: 400px;
  background-color: white;
  position:absolute;
  right:20px;
  top: 20px;
  box-sizing: border-box;
  padding:20px
  font-size:10px
`;

class Controlls extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    sounds: PropTypes.array,
    position: PropTypes.number,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ControllsOuter>
        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
          <a href="#" onClick={this.props.onPlayingChange}>
            {this.props.playing ? 'playing' : 'paused'}
          </a>
          <a href='#' onClick={this.props.onSaveSettings}>save</a>
          </div>
          <span> Track Position </span>
          <Checkbox checked={this.props.trackPosition} onChange={this.props.onTrackPositionToggle}/>
        <p>Position</p>
        <Slider
          min={0}
          max={100}
          step={1}
          value={this.props.position}
          onChange={this.props.onPositionChange}
          style={{width: '90%'}}
        />

        <p>Range</p>
        <Range
          min={0}
          max={100000}
          step={1}
          value={this.props.range}
          onChange={this.props.onRangeChange}
          style={{width: '90%'}}
        />

        <p>Smoothing</p>
        <Slider
          min={0}
          max={100}
          step={1}
          value={this.props.smoothing}
          onChange={this.props.onSmoothingChange}
          style={{width: '90%'}}
        />
        <p>{this.props.rawCompression}</p>
        <p>{this.props.scaledCompression}</p>
        <div style={{height:'600px', overflowY: 'scroll'}}>
          {this.props.sounds.map((s, index) => {
            const position = this.props.position;
            const active = position < s.end && position > s.start;
            const color = active ? 'red' : 'black';
            return (
              <div key={index}  >
                <p style={{color: color}}>{s.name}</p>
                <Range
                  allowCross={false}
                  min={0}
                  max={100}
                  step={1}
                  pushable={true}
                  count={4}
                  value={[s.fadeInStart,s.start, s.end, s.fadeOutEnd]}
                  style={{flex: '90%'}}
                  onChange={r =>
                    this.props.onUpdateSound(
                      {...s, fadeInStart:r[0], start: r[1], end: r[2], fadeOutEnd: r[3]},
                      index,
                    )
                  }
                />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={s.volume}
                    style={{width: '90%', marginRight:'20px'}}
                    onChange={v =>
                      this.props.onUpdateSound({...s, volume: v}, index)
                    }
                  />
                  <Checkbox
                    checked={s.on}
                    onChange={() => {
                      this.props.onUpdateSound({...s, on: !s.on}, index);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </ControllsOuter>
    );
  }
}

export default Controlls;
