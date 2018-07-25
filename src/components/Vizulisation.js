import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

class Vizulisation extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.size_scale = d3.scaleLinear()
      .domain([0,100])
      .range([40,10])

    this.color_scale = d3
      .scaleLinear()
      .domain([ 0,100])
      .range(['#ff0134', '#0263ff'])
      .interpolate(d3.interpolateHcl);
    this.onResize = this.onResize.bind(this);
  }

  componentWillMount() {
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize() {
    this.setState({
      width: window.outerWidth,
      height: window.outerHeight,
    });
  }

  render() {
    const color = d3.color(this.color_scale(this.props.position)).hex();
    return (
      <svg viewBox="0 0 100 100" style={{width: '100%', height: '100%', position:'absolute', left:0, top:0, backgroundColor:'#7a0e26'}}>
        <circle cx={50} cy={50} r={this.size_scale(this.props.position)} fill={color} />
      </svg>
    );
  }
}

export default Vizulisation;
