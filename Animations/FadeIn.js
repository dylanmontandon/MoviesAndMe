// Animations/FadeIn.js

import React from 'react'
import { Animated, Dimensions } from 'react-native'

class FadeIn extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      positionLeft: new Animated.Value(Dimensions.get('window').width) //on définit la position tout à droite (en dehors de l'écran)
    }
  }

  componentDidMount() {
    Animated.spring(
      this.state.positionLeft,
      {
        toValue: 0 //on fiat en sorte que la posistion soit à 0 -> cela va faire avancer l'élément de droite à gauche
      }
    ).start()
  }

  render() {
    return (
      <Animated.View
        style={{ left: this.state.positionLeft }}>
        {this.props.children}
      </Animated.View>
    )
  }
}

export default FadeIn
