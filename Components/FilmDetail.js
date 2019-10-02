// Components/FilmDetail.js

import React from 'react'
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, Image, Button, TouchableOpacity } from 'react-native'
import { getFilmDetailFromApi } from '../API/TMDBApi'
import { getImageFromApi } from '../API/TMDBApi'
import moment from 'moment'
import numeral from 'numeral'
import { connect } from 'react-redux'

class FilmDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      film: undefined,
      isLoading: true
    }
  }

  componentDidMount() {
    getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(data => {
      this.setState({
        film: data,
        isLoading: false
      })
    })
  }

  componentDidUpdate() {
    //console.log("componentDidUpdate : ")
    //console.log(this.props.favoritesFilm)
  }

  _displayLoading() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size='large' />
        </View>
      )
    }
  }

  _toggleFavorite() {
        // Définition de notre action ici
        const action = { type: "TOGGLE_FAVORITE", value: this.state.film }
        // dispatch l'action au Store
        this.props.dispatch(action)
    }

  _displayFilm() {
    if (this.state.film != undefined) {
      return (
        <ScrollView style={styles.scrollview_container}>
          <View style={styles.image_container}>
            <Image
              style={styles.image}
              source={{uri: getImageFromApi(this.state.film.backdrop_path)}}
            />
          </View>
          <View style={styles.title_container}>
            <Text style={styles.title_text}>{this.state.film.title}</Text>
            <TouchableOpacity
                onPress={() => this._toggleFavorite()}>
                {this._displayFavoriteImage()}
            </TouchableOpacity>
          </View>
          <View style={styles.description_container}>
            <Text style={styles.description_text}>{this.state.film.overview}</Text>
          </View>
          <View style={styles.detail_container}>
            <Text>Sorti le : {moment(this.state.film.release_date, "YYYY-MM-DD").format("DD.MM.YYYY")}</Text>
            <Text>Note : {this.state.film.vote_average}</Text>
            <Text>Nombre de votes : {this.state.film.vote_count}</Text>
            <Text>Budget : {numeral(this.state.film.budget).format("0,0[.]00 $")}</Text>
            <Text>Genre(s) : {this.state.film.genres.map(function(genre){
              return genre.name;
            }).join(" / ")}</Text>
            <Text>Companie(s) : {this.state.film.production_companies.map(function(company){
              return company.name;
            }).join(" / ")}</Text>
          </View>

        </ScrollView>
      )
    }
  }

  _displayFavoriteImage() {
    var sourceImage = require('../Images/ic_favorite_border.png')
    if (this.props.favoritesFilm.findIndex(item => item.id === this.state.film.id) !== -1) {
      // Film dans nos favoris
      sourceImage = require('../Images/ic_favorite.png')
    }
    return (
      <Image
        style={styles.favorite_image}
        source={sourceImage}
      />
    )
}

  render() {
    //console.log(this.props)
    return (
      <View style={styles.main_container}>
        {this._displayLoading()}
        {this._displayFilm()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1
  },
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollview_container: {
    flex: 1
  },
  title_container: {
    flex: 1,
    alignItems: 'center'
  },
  title_text: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  description_container: {
    margin: 10,
    flex: 1
  },
  description_text: {
    flex: 1,
    color: 'gray',
    fontStyle: 'italic'
  },
  image: {
    flex: 1,
    margin: 10,
    height: 170
  },
  detail_container: {
    flex: 1,
    margin: 10
  },
  favorite_container: {
    alignItems: 'center', // Alignement des components enfants sur l'axe secondaire, X ici
  },
  favorite_image: {
    width: 40,
    height: 40
  }
})

//permet de connecter le state de l'application au component FilmDetail.
//If this argument is specified, the new component will subscribe to Redux store updates.
//This means that any time the store is updated, mapStateToProps will be called.
//The results of mapStateToProps must be a plain object, which will be merged into the component’s props.
const mapStateToProps = (state) => {
  //return state -> retourne tout le state, pas une bonne pratique
  return {
    favoritesFilm: state.favoritesFilm
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => { dispatch(action) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FilmDetail)
