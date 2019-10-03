// Components/FilmList.js

import FilmItem from './FilmItem'

import React from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { connect } from 'react-redux'

class FilmList extends React.Component {

  constructor(props) {
      super(props)
      this.state = {
        films: []
      }
    }

    _displayDetailForFilm = (idFilm) => {
      console.log("Display film " + idFilm)
      // On a récupéré les informations de la navigation, on peut afficher le détail du film
      this.props.navigation.navigate("FilmDetail", {idFilm: idFilm})
   }

   render() {
       return (
           <FlatList
             style={styles.list}
             data={this.props.films}
             extraData={this.props.favoritesFilm}
             keyExtractor={(item) => item.id.toString()}
             renderItem={({item}) => (
               <FilmItem
                 film={item}
                 isFilmFavorite={(this.props.favoritesFilm.findIndex(film => film.id === item.id) !== -1) ? true : false}
                 displayDetailForFilm={this._displayDetailForFilm}
               />
             )}
             onEndReachedThreshold={0.5}
             onEndReached={() => {
               if (!this.props.favoriteList && this.props.page < this.props.totalPages) {
                 // On appelle la méthode loadFilm du component Search pour charger plus de films
                 this.props.loadFilms()
               }
             }}
           />
       )
     }
   }

   const styles = StyleSheet.create({
     list: {
       flex: 1
     }
   })

//permet de connecter le state de l'application au component FilmDetail.
//If this argument is specified, the new component will subscribe to Redux store updates.
//This means that any time the store is updated, mapStateToProps will be called.
//The results of mapStateToProps must be a plain object, which will be merged into the component’s props.
const mapStateToProps = state => {
  return {
    favoritesFilm: state.favoritesFilm
  }
}

export default connect(mapStateToProps)(FilmList)
