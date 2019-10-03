// Components/Favorites.js

import React from 'react'
import { StyleSheet, Text } from 'react-native'
import FilmList from './FilmList'
import { connect } from 'react-redux'

class Favorites extends React.Component {

  _displayDetailForFilm = (idFilm) => {
    console.log("Display film " + idFilm)
    // On a récupéré les informations de la navigation, on peut afficher le détail du film
    this.props.navigation.navigate("FilmDetail", {idFilm: idFilm})
 }

  render() {
    console.log("favorites film: " + this.props.favoritesFilm)
    return (
      <FilmList
        films={this.props.favoritesFilm} // C'est bien le component Search qui récupère les films depuis l'API et on les transmet ici pour que le component FilmList les affiche
        navigation={this.props.navigation} // Ici on transmet les informations de navigation pour permettre au component FilmList de naviguer vers le détail d'un film
        favoriteList={true} //on transmet dans les props le fait que la liste soit celle des films favoris -> ne pas load plus de films
      />
    )
  }
}

const styles = StyleSheet.create({})

//permet de connecter le state de l'application au component FilmDetail.
//If this argument is specified, the new component will subscribe to Redux store updates.
//This means that any time the store is updated, mapStateToProps will be called.
//The results of mapStateToProps must be a plain object, which will be merged into the component’s props.
const mapStateToProps = state => {
  return {
    favoritesFilm: state.favoritesFilm
  }
}

export default connect(mapStateToProps)(Favorites)
