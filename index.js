'use strict'

import React from 'react';
import { View, Dimensions, Animated, StyleSheet } from 'react-native';
const { height,width } = Dimensions.get('window');
const styles = StyleSheet.create({container:{position:'absolute',top:0,left:0,right:0,bottom:0}})

export default class Alert extends React.Component {

 static propTypes = {
    entrance: React.PropTypes.oneOf(['fromTop','fromBottom','fromLeft','fromRight']).isRequired,
    backgroundColor: React.PropTypes.string.isRequired,
    show: React.PropTypes.bool.isRequired
  }

constructor(props){
  super(props);
  this.state = {
    offset: new Animated.Value(0),
    show:props.show
  };
};

componentDidMount(){
  if (this.state.show) {
    this.animateIn()
  }
}

componentWillReceiveProps(nextProps){
  if (nextProps.show !== this.props.show) {
    if (nextProps.show) {
      this.animateIn()
    } else {
      this.animateOut()
    }
  }
}

animateIn = () => {
  this.setState({show:true})
  Animated.spring(this.state.offset,{
    toValue: 1
  }).start()
}

animateOut = () => {
  this.setState({show:false})
  Animated.spring(this.state.offset,{
    toValue: 0
  }).start()
}

calculateTranslate = () => {
  switch (this.props.entrance) {
    case 'fromBottom':
      return {
        transform: [{
          translateY: this.state.offset.interpolate({
            inputRange: [0,1],
            outputRange: [height,0]
          })
        }]
      }
      break;
    case 'fromTop':
      return {
        transform: [{
          translateY: this.state.offset.interpolate({
            inputRange: [0,1],
            outputRange: [-height,0]
          })
        }]
      }
      break;

    case 'fromLeft':
      return {
        transform: [{
          translateX: this.state.offset.interpolate({
            inputRange: [0,1],
            outputRange: [-width,0]
          })
        }]
      }
      break;

    case 'fromRight':
      return {
        transform: [{
          translateX: this.state.offset.interpolate({
            inputRange: [0,1],
            outputRange: [width,0]
          })
        }]
      }
      break;

    default:

  }
}

render(){
  let { backgroundColor:b } = this.props
  return(
    <Animated.View style={[ styles.container,{backgroundColor:b},this.calculateTranslate() ]}>
      { this.props.children }
    </Animated.View>
  )
};

};
