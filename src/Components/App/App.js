import React from 'react';
import logo from './logo.svg';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

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
  }

  addTrack(track) {
    //adds a new track to the playlist
    const myList = this.state.playlistTracks;

    if(this.state.playlistTracks.filter( savedTrack => {
      return savedTrack.id === track.id
    }).length === 0){
      myList.push(track);
      this.setState({
        playlistTracks : myList
      })
    }
  }

  removeTrack(track) {
    const index = this.state.playlistTracks.findIndex( savedTrack => {
      return savedTrack.id === track.id;
    })
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
