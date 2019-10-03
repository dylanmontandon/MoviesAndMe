// Animations/FadeIn.js

import React from 'react'
import { Animated, Dimensions } from 'react-native'

class Grow extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      scaleImageX: new Animated.Value(40), //on définit la taille initial du component
      scaleImageY: new Animated.Value(40)
    }
  }

  componentDidMount() {
    Animated.parallel([
      Animated.spring(
        this.state.scaleImageX,
        {
          toValue: 80
        }
      ),
      Animated.spring(
        this.state.scaleImageY,
        {
          toValue: 80
        }
      )
    ]).start()
  }

  render() {
    return (
      <Animated.View
        style={{ scaleImageX: this.state.scaleImageX, scaleImageY: this.state.scaleImageY }}>
        {this.props.children}
      </Animated.View>
    )
  }
}

export default Grow
