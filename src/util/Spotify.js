
let accessToken;
const clientId = '<app client id>';
const redirectURI = 'http://localhost:3000/';
const Spotify = {
    getAccessToken: function () {
        if (accessToken) {
            return accessToken;
        }

        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1]; //accessTokenMatch is an array
            const expiresIn = Number(expiresInMatch[1]); //expiresInMatch is an array 
            //clear accessToken to allow users to login again
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
        }
    },
    search: function (term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${accessToken}` }
        })
            .then(response => {
                if (!response.ok) {
                    throw Error(response.status)
                } else {
                    return response.json();                    
                }
            })
            .then(jsonResponse => {
                if (!jsonResponse.tracks) {
                    return [];
                }
                return jsonResponse.tracks.items.map(track => {
                    return {
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri
                    }
                })
            })
    },
    savePlaylist: function (name, trackURIs) {
        if (!name || !trackURIs.length) {
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };
        let userId;
        return fetch('https://api.spotify.com/v1/me', { headers: headers })
            .then(response => response.json())
            .then(jsonResponse => {
                userId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
                    {
                        headers: headers,
                        method: 'POST',
                        body: JSON.stringify({ name: name })
                    }).then(response => response.json())
                    .then(jsonResponse => {
                        const playlistId = jsonResponse.id
                        return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
                        {
                            headers: headers,
                            method: 'POST',
                            body: JSON.stringify({
                                uris: trackURIs
                            })
                        })
                    })
            })
    }

}

export default Spotify;