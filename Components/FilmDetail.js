// Components/FilmDetail.js

import React from 'react'
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, Image, Button, TouchableOpacity, Share, Platform } from 'react-native'
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
      isLoading: false
    }
    // Ne pas oublier de binder la fonction _shareFilm sinon, lorsqu'on va l'appeler depuis le headerRight de la navigation, this.state.film sera undefined et fera planter l'application
    this._shareFilm = this._shareFilm.bind(this)
  }

  static navigationOptions = ({ navigation }) => {
      const { params } = navigation.state
      // On accède à la fonction shareFilm et au film via les paramètres qu'on a ajouté à la navigation
      if (params.film != undefined && Platform.OS === 'ios') {
        return {
            // On a besoin d'afficher une image, il faut donc passe par une Touchable une fois de plus
            headerRight: <TouchableOpacity
                            style={styles.share_touchable_headerrightbutton}
                            onPress={() => params.shareFilm()}>
                            <Image
                              style={styles.share_image}
                              source={require('../Images/ic_share.png')} />
                          </TouchableOpacity>
        }
      }
  }

  _shareFilm() {
    const {film} = this.state;
    Share.share({ title: film.title, message: film.overview})
  }

  _displayFloatingActionButton() {
    const { film } = this.state
    if (film != undefined && Platform.OS === 'android') { // Uniquement sur Android et lorsque le film est chargé
      return (
        <TouchableOpacity
          style={styles.share_touchable_floatingactionbutton}
          onPress={() => this._shareFilm()}>
          <Image
            style={styles.share_image}
            source={require('../Images/ic_share.png')} />
        </TouchableOpacity>
      )
    }
  }

  // Fonction pour faire passer la fonction _shareFilm et le film aux paramètres de la navigation. Ainsi on aura accès à ces données au moment de définir le headerRight
  _updateNavigationParams() {
    this.props.navigation.setParams({
      shareFilm: this._shareFilm,
      film: this.state.film
    })
  }

  // Dès que le film est chargé, on met à jour les paramètres de la navigation (avec la fonction _updateNavigationParams) pour afficher le bouton de partage
  componentDidMount() {
    const favoriteFilmIndex = this.props.favoritesFilm.findIndex(item => item.id === this.props.navigation.state.params.idFilm)
    if (favoriteFilmIndex !== -1) { // Film déjà dans nos favoris, on a déjà son détail
      // Pas besoin d'appeler l'API ici, on ajoute le détail stocké dans notre state global au state de notre component
      this.setState({
        film: this.props.favoritesFilm[favoriteFilmIndex]}, () => { this._updateNavigationParams() })
      return
    }
    
    // Le film n'est pas dans nos favoris, on n'a pas son détail
    // On appelle l'API pour récupérer son détail
    this.setState({ isLoading: true })
    getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(data => {
      this.setState({
        film: data,
        isLoading: false
      }, () => { this._updateNavigationParams()})
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
        {this._displayFloatingActionButton()}
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
  },
  share_touchable_floatingactionbutton: {
   position: 'absolute',
   width: 60,
   height: 60,
   right: 30,
   bottom: 30,
   borderRadius: 30,
   backgroundColor: '#e91e63',
   justifyContent: 'center',
   alignItems: 'center'
 },
 share_image: {
   width: 30,
   height: 30
 },
 share_touchable_headerrightbutton: {
    marginRight: 8
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
