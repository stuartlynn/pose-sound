import React, { Component } from 'react';
import PropTypes from 'prop-types';

const OSCContext= React.createContext()

class OSCProvider extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  state={
    onPoseChange: this.onPoseChange.bind(this)
  }

  constructor(props) {
    super(props);
  }

  onPoseChange(pose){
    this.setState({pose})
    console.log('pose ',pose)
  }
  render() {
    return (
      <OSCContext.Provider value={this.state}>
        {this.props.children}
      </OSCContext.Provider>
    );
  }
}

export const OSCConsumer = OSCContext.consumer
export default OSCProvider;
