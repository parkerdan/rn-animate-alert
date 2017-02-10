'use strict'

import React from 'react';
import { View, Dimensions, Animated, StyleSheet, Modal, Easing } from 'react-native';
const { height,width } = Dimensions.get('window');
const styles = StyleSheet.create({container:{position:'absolute',top:0,left:0,right:0,bottom:0}})

export default class Alert extends React.Component {

 static propTypes = {
    entrance: React.PropTypes.oneOf(['fromTop','fromBottom','fromLeft','fromRight']).isRequired,
    backgroundColor: React.PropTypes.string.isRequired,
    show: React.PropTypes.bool.isRequired
  }

constructor(props){
  super(props)
  this.state = {
    offset: new Animated.Value(0),
    show:props.show,
  }
}

componentWillReceiveProps(nextProps){
  if (nextProps.show !== this.props.show) {
    if (nextProps.show) {
      this.setState({show:true})
    } else {
      this.animateOut()
    }
  }
}

animateIn = () => {
  Animated.spring(this.state.offset,{
    toValue: 1
  }).start()
}

animateOut = () => {
  Animated.timing(this.state.offset,{
    toValue: 0,
    duration: 500,
    easing: Easing.inOut(Easing.ease)
  }).start( () => this.setState({show:false}) )
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
      break
    case 'fromTop':
      return {
        transform: [{
          translateY: this.state.offset.interpolate({
            inputRange: [0,1],
            outputRange: [-height,0]
          })
        }]
      }
      break

    case 'fromLeft':
      return {
        transform: [{
          translateX: this.state.offset.interpolate({
            inputRange: [0,1],
            outputRange: [-width,0]
          })
        }]
      }
      break

    case 'fromRight':
      return {
        transform: [{
          translateX: this.state.offset.interpolate({
            inputRange: [0,1],
            outputRange: [width,0]
          })
        }]
      }
      break
  }
}

render(){
  const { backgroundColor } = this.props
  return(
    <Modal
      animationType={'fade'}
      transparent={true}
      visible={ this.state.show }
      onShow={ this.animateIn }
      onRequestClose={ () => {} }
    >
      <View style={[styles.container,{backgroundColor:backgroundColor}]}>
        <Animated.View style={[ styles.container,this.calculateTranslate() ]}>
          { this.props.children }
        </Animated.View>
      </View>
    </Modal>
  )
}

}
