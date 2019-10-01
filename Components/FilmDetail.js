// Components/FilmDetail.js

import React from 'react'
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, Image } from 'react-native'
import { getFilmDetailFromApi } from '../API/TMDBApi'
import { getImageFromApi } from '../API/TMDBApi'
import moment from 'moment'
import numeral from 'numeral'

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

  _displayLoading() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size='large' />
        </View>
      )
    }
  }

  _displayFilm() {
    if (this.state.film != undefined) {
      console.log(getImageFromApi(this.state.film.backdrop_path))
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

  render() {
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
  }
})

export default FilmDetail
