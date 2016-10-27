'use strict'

import React, { Component, PropTypes } from 'react';
import {
View,
Dimensions,
Text,
TouchableOpacity,
Animated,
Easing
} from 'react-native';

const { height,width } = Dimensions.get('window');

const propTypes = {
onConfirm: React.PropTypes.func.isRequired,
onCancel: React.PropTypes.func.isRequired,

title: React.PropTypes.string.isRequired,
titleTextStyle: React.PropTypes.oneOfType([React.PropTypes.number,React.PropTypes.object,React.PropTypes.array]),

detailText: React.PropTypes.string,
detailTextStyle: React.PropTypes.oneOfType([React.PropTypes.number,React.PropTypes.object,React.PropTypes.array]),

confirmText: React.PropTypes.string,
confirmTextStyle:React.PropTypes.oneOfType([React.PropTypes.number,React.PropTypes.object,React.PropTypes.array]),
confirmButtonStyle:React.PropTypes.oneOfType([React.PropTypes.number,React.PropTypes.object,React.PropTypes.array]),

cancelText: React.PropTypes.string,
cancelTextStyle: React.PropTypes.oneOfType([React.PropTypes.number,React.PropTypes.object,React.PropTypes.array]),
cancelButtonStyle:React.PropTypes.oneOfType([React.PropTypes.number,React.PropTypes.object,React.PropTypes.array]),

backgroundColor: React.PropTypes.string,

containerStyle: React.PropTypes.oneOfType([React.PropTypes.number,React.PropTypes.object,React.PropTypes.array]),

springFromBottom: React.PropTypes.bool,
springFromTop: React.PropTypes.bool,

zIndex: React.PropTypes.number, // try and avoid this.  only needed if you used zIndex elsewhere

};

export default class Alert extends Component {

 constructor(props){
   super(props);
   this.dismiss = this.dismiss.bind(this);

   this.state = {
   };
 };

 componentWillMount(){
   let xOffset = new Animated.Value(0);
   let yOffset = new Animated.Value(0);


   if (this.props.springFromBottom) {
     yOffset.setValue(1)
   }
   if (this.props.springFromTop) {
     yOffset.setValue(-1)
   }

   this.setState({xOffset:xOffset,yOffset:yOffset})
 };

 componentDidMount(){
   Animated.parallel([
     Animated.spring(this.state.yOffset,{
       toValue:0
     })
   ]).start()
 };

 dismiss(cb){
   let toValue = 0;
   if (this.props.springFromBottom) {
     toValue = 1;
   }
   if (this.props.springFromTop) {
     toValue = -1;
   }
   Animated.timing(this.state.yOffset,{
     toValue: toValue,
     duration: 200,
     easing: Easing.linear
   }).start(cb)
 };

 renderText(){
   if (this.props.detailText) {
     return(
       <Text style={[{
         marginBottom:10
       },this.props.detailTextStyle]}>
         {this.props.detailText}
       </Text>
     )
   }
 };

 render(){
   return(
     <View style={{
       zIndex:this.props.zIndex || 0,
       position:'absolute',
       top:0,
       left:0,
       height:height,
       width:width,
       backgroundColor: this.props.backgroundColor || 'rgba(111,111,111,.9)',
       alignItems:'center',
       justifyContent:'center'
     }}>
       <Animated.View style={[{
         backgroundColor: 'white',
         borderRadius:5,
         padding:10
       },this.props.containerStyle,{
         transform:[{
           translateY:this.state.yOffset.interpolate({
             inputRange: [-1,0,1],
             outputRange: [-500,0,500]
           })}]}]}>

         <Text style={[{
           fontSize:20,
           fontWeight:'500',
           marginBottom:10,
         },this.props.titleTextStyle]}>
           {this.props.title}
         </Text>

         {this.renderText()}

         <View style={{
           flexDirection: 'row'
         }}>
           <View style={{
             flex:1,
             paddingRight:10
           }}>
             <TouchableOpacity
               style={[{
                 borderRadius:5,
                 padding:5,
                 backgroundColor:'red',
                 alignItems:'center'
               },this.props.cancelButtonStyle]}
               onPress={
                 () => this.dismiss(this.props.onCancel)
               }>
               <Text style={[{
                 color:'white',
                 fontWeight:'700'
               },this.props.cancelTextStyle]}>
                 {(this.props.cancelText) ? this.props.cancelText:'Cancel'}
               </Text>
             </TouchableOpacity>
           </View>

           <View style={{
             flex:1,
             paddingLeft:10
           }}>
             <TouchableOpacity
               style={[{
                 borderRadius:5,
                 padding:5,
                 alignItems:'center',
                 backgroundColor:'blue',
               },this.props.confirmButtonStyle]}
               onPress={
                 () => this.dismiss(this.props.onConfirm)
               }>
               <Text style={[{
                 color:'white',
                 fontWeight:'700'
               },this.props.confirmTextStyle]}>
                 {(this.props.confirmText) ? this.props.confirmText:'Ok'}
               </Text>
             </TouchableOpacity>
           </View>

         </View>
       </Animated.View>
     </View>
   )
 };

};

Alert.propTypes = propTypes;
