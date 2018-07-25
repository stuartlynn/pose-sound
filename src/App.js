import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import PoseDetector from './components/PoseDetector';
import OSCProvider, {OSCConsumer} from './contexts/OSCProvider';
import SoundBoard from './components/SoundBoard';
import Vizulisation from './components/Vizulisation';
import Controlls from './components/Controlls';
import Sounds from './sounds';

class App extends Component {
  state = {
    similarities: [],
    sounds: Sounds.map(s => ({...s, on: true})),
    position: 0,
    showControlls: false,
    range: [100, 500],
    rawCompression: 200,
    scaledCompression: 200,
    playing: false,
    trackPosition: false,
  };

  handleKeyDown(event) {
    console.log(event);
    switch (event.key) {
      case 'c':
        this.setState({showControlls: !this.state.showControlls});
      case 'b':
        this.setState({
          range: [this.state.range[0], this.state.rawCompression],
        });
      case 's':
        this.setState({
          range: [this.state.rawCompression, this.state.range[1]],
        });
    }
  }
  loadSettings() {
    console.log('attempting to get sounds');
    if (localStorage.getItem('sounds')) {
      console.log('got sounds', JSON.parse(localStorage.getItem('sounds')));
      this.setState({
        sounds: JSON.parse(localStorage.getItem('sounds')),
      });
    }
  }
  saveSettings() {
    alert('saved');
    localStorage.setItem('sounds', JSON.stringify(this.state.sounds));
  }

  componentDidMount() {
    this.loadSettings();
  }
  componentWillMount() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }
  updateSound(sound, index) {
    this.setState({
      sounds: this.state.sounds.map((s, i) => (index !== i ? s : sound)),
    });
  }
  compressionChanged(compression) {
    const range = this.state.range;
    const scaledCompression = 100*(compression - range[0]) / (range[1] - range[0]);
    const oldPosition = this.state.position

    const exponentalAvg = scaledCompression * 0.7 + (1-0.7)* oldPosition

    const position = this.state.trackPosition ? exponentalAvg : oldPosition

    this.setState({
      rawCompression: compression,
      scaledCompression: scaledCompression,
      position : position
    });
  }
  updateRange(range) {
    this.setState({range});
  }
  render() {
    return (
      <div className="App">
        <PoseDetector
          onCompressionChange={compression =>
            this.compressionChanged(compression)
          }
          showVis={this.state.showControlls}
        />
        <SoundBoard
          position={this.state.position}
          sounds={this.state.sounds}
          playing={this.state.playing}
        />
        <Vizulisation position={this.state.position} />

        {this.state.showControlls && (
          <Controlls
            position={this.state.position}
            range={this.state.range}
            onRangeChange={this.updateRange.bind(this)}
            onPositionChange={position => this.setState({position})}
            sounds={this.state.sounds}
            onUpdateSound={this.updateSound.bind(this)}
            rawCompression={this.state.rawCompression}
            scaledCompression={this.state.scaledCompression}
            playing={this.state.playing}
            onSaveSettings={this.saveSettings.bind(this)}
            trackPosition={this.state.trackPosition}
            onTrackPositionToggle={() =>
              this.setState({trackPosition: !this.state.trackPosition})
            }
            onPlayingChange={() =>
              this.setState({playing: !this.state.playing})
            }
          />
        )}
      </div>
    );
  }
}

export default App;
