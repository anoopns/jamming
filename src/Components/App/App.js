import React from 'react';
import logo from './logo.svg';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [{
        name: 'name1',
        artist: 'artist1',
        album: 'album1',
        id: 1
      },
      {
        name: 'name2',
        artist: 'artist2',
        album: 'album2',
        id: 2
      }],
      playlistName: 'my playlist',
      playlistTracks: [{
        name: 'name1',
        artist: 'artist1',
        album: 'album1',
        id: 1
      }]
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    //adds a new track to the playlist
    if (this.state.playlistTracks.filter(savedTrack => {
      return savedTrack.id === track.id
    }).length === 0) {
      const myList = this.state.playlistTracks;
      myList.push(track);
      this.setState({
        playlistTracks: myList
      })
    }
  }

  removeTrack(track) {
    //removes a track from the playlist
    const index = this.state.playlistTracks.findIndex(savedTrack => {
      return savedTrack.id === track.id;
    })
    if (index !== -1) {
      const myList = this.state.playlistTracks;
      myList.splice(index, 1);
      this.setState({
        playlistTracks: myList
      })
    }
  }

  updatePlaylistName(name) {
    this.setState({
      playlistName: name
    })
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    })
  }

  search(searchTerm) {
    Spotify.search(searchTerm)
      .then(results => {
        this.setState({
          searchResults: results
        })
      })
      .catch(error => {

      })
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
