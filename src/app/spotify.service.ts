import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  constructor(private http: HttpClient) {
    const clientId = '0a085d9cc154415bb655ac4e345de658';
    const scope = [
      'user-read-private',
      'user-read-email',
      'user-top-read',
      'user-library-read',
      'user-library-modify',
      'user-read-recently-played',
      'user-read-currently-playing',
      'user-read-playback-state',
      'user-modify-playback-state',
      'playlist-modify-public',
      'playlist-modify-private'
    ];
    const baseElement: HTMLElement = document.querySelector('base');
    const redirectUri = baseElement.getAttribute('href').length > 0
      ? baseElement.getAttribute('href')
      : 'http://' + window.location.host;
    const uri = 'https://accounts.spotify.com/authorize' +
    '?client_id=' + clientId +
    '&response_type=token' +
    '&redirect_uri=' + encodeURIComponent(redirectUri) +
    '&scope=' + scope.join('%20');
    localStorage.setItem('spotifyUrlAuthorize', uri);
  }

  search(query: string, searchBy?: string, limit?: number, searchWhat?: string): Observable<any> {
    const spotifyEndpoint = 'https://api.spotify.com/v1/search' +
      '?q=' + (searchBy ? searchBy + ':' : '') + encodeURIComponent(query) +
      '&type=' + encodeURIComponent(searchWhat || 'track') +
      (limit ? '&limit=' + limit : '');
    return this.http.get<any>(spotifyEndpoint, this.getOptions()).pipe( tap(), catchError(this.handleError) );
  }

  getPlaylist(id: string) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/playlists/' + id;
    return this.http.get<any>(spotifyEndpoint, this.getOptions()).pipe( tap(), catchError(this.handleError) );
  }

  getPlaylistTracks(id: string, offset?: number) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/playlists/' + id + '/tracks' + (offset ? '?offset=' + offset : '');
    return this.http.get<any>(spotifyEndpoint, this.getOptions()).pipe( tap(), catchError(this.handleError) );
  }

  createPlaylist(name: string, pub: boolean, description: string) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/playlists';
    return this.http.post<any>(spotifyEndpoint, { name, public: pub, description }, this.getOptions()).pipe( tap(), catchError(this.handleError) );
  }

  replaceTracksToPlaylist(id: string, uris: string[]) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/playlists/' + id + '/tracks';
    return this.http.put<any>(spotifyEndpoint, { uris }, this.getOptions()).pipe( tap(), catchError(this.handleError) );
  }

  addTracksToPlaylist(id: string, uris: string[], position?: number) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/playlists/' + id + '/tracks';
    return this.http.post<any>(spotifyEndpoint, { uris, position }, this.getOptions()).pipe( tap(), catchError(this.handleError) );
  }

  getArtist(id: string) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/artists/' + id;
    return this.http.get<any>(spotifyEndpoint, this.getOptions()).pipe( tap(), catchError(this.handleError) );
  }

  getArtistTopTracks(id: string) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/artists/' + id + '/top-tracks?country=PH';
    return this.http.get<any>(spotifyEndpoint, this.getOptions()).pipe( tap(), catchError(this.handleError) );
  }

  getArtistAlbums(id: string) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/artists/' + id + '/albums?market=PH';
    return this.http.get<any>(spotifyEndpoint, this.getOptions()).pipe( tap(), catchError(this.handleError) );
  }

  getAlbum(id: string) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/albums/' + id;
    return this.http.get<any>(spotifyEndpoint, this.getOptions()).pipe( tap(), catchError(this.handleError) );
  }

  getAlbumTracks(id: string) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/albums/' + id + '/tracks?limit=50';
    return this.http.get<any>(spotifyEndpoint, this.getOptions()).pipe( tap(), catchError(this.handleError) );
  }

  getNewReleases(limit?: number) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/browse/new-releases' +
      (limit ? '?limit=' + limit : '');
    return this.http.get<any>(spotifyEndpoint, this.getOptions()).pipe( tap(), catchError(this.handleError) );
  }

  getUser(id?: string) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/' + (id ? 'users/' + id : 'me');
    return this.http.get<any>(spotifyEndpoint, this.getOptions()).pipe( tap(), catchError(this.handleError) );
  }

  getUserPlaylists(id?: string, offset?: number, limit?: number) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/' + (id ? 'users/' + id : 'me') + '/playlists?limit=' + (limit ? limit : 50) + '&offset=' + (offset ? offset : 0);
    return this.http.get<any>(spotifyEndpoint, this.getOptions()).pipe( tap(), catchError(this.handleError) );
  }

  getUserTopTracks(limit?: number, timeRange?: string) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/top/tracks' +
      (limit ? '?limit=' + limit : '') +
      (timeRange ? '&time_range=' + timeRange : '&time_range=long_term');
    return this.http.get<any>(spotifyEndpoint, this.getOptions()).pipe( tap(), catchError(this.handleError) );
  }

  getUserTopArtists(limit?: number, timeRange?: string) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/top/artists' +
      (limit ? '?limit=' + limit : '') +
      (timeRange ? '&time_range=' + timeRange : '&time_range=long_term');
    return this.http.get<any>(spotifyEndpoint, this.getOptions()).pipe( tap(), catchError(this.handleError) );
  }

  getUserSavedTracks(limit?: number) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/tracks' +
      (limit ? '?limit=' + limit : '');
    return this.http.get<any>(spotifyEndpoint, this.getOptions()).pipe( tap(), catchError(this.handleError) );
  }

  savedTrack(id: string) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/tracks?ids=' + id;
    return this.http.put<any>(spotifyEndpoint, null, this.getOptions()).pipe( tap(), catchError(this.handleError) );
  }

  removeTrack(id: string) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/tracks?ids=' + id;
    return this.http.delete<any>(spotifyEndpoint, this.getOptions()).pipe( tap(), catchError(this.handleError) );
  }

  getRecentlyPlayed(limit?: number) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/player/recently-played' +
    (limit ? '?limit=' + limit : '');
    return this.http.get<any>(spotifyEndpoint, this.getOptions()).pipe( tap(), catchError(this.handleError) );
  }

  getCurrentPlayback() {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/player';
    return this.http.get<any>(spotifyEndpoint, this.getOptions()).pipe( tap(), catchError(this.handleError) );
  }

  getDevices() {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/player/devices';
    return this.http.get<any>(spotifyEndpoint, this.getOptions()).pipe( tap(), catchError(this.handleError) );
  }

  playToDevice(deviceIds: string, transferOnly?: boolean) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/player';
    const data = { device_ids: [deviceIds], play: (transferOnly === true ? false : true) };
    return this.http.put<any>(spotifyEndpoint, data, this.getOptions()).pipe( tap(), catchError(this.handleError) );
  }

  playTrack(contextUri?: string, uris?: string[], offset?: string) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/player/play';
    const data = { context_uri: contextUri, uris, offset: (offset ? { uri: offset } : null) };
    return this.http.put<any>(spotifyEndpoint, data, this.getOptions()).pipe( tap(), catchError(this.handleError) );
  }

  setRepeatMode(state: string) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/player/repeat?state=' + state;
    return this.http.put<any>(spotifyEndpoint, null, this.getOptions()).pipe( tap(), catchError(this.handleError) );
  }

  toggleShuffle(state: boolean) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/player/shuffle?state=' + state;
    return this.http.put<any>(spotifyEndpoint, null, this.getOptions()).pipe( tap(), catchError(this.handleError) );
  }

  skipToPreviousTrack() {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/player/previous';
    return this.http.post<any>(spotifyEndpoint, null, this.getOptions()).pipe( tap(), catchError(this.handleError) );
  }

  skipToNextTrack() {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/player/next';
    return this.http.post<any>(spotifyEndpoint, null, this.getOptions()).pipe( tap(), catchError(this.handleError) );
  }

  seek(position: number) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/player/seek?position_ms=' + Math.floor(position);
    return this.http.put<any>(spotifyEndpoint, null, this.getOptions()).pipe( tap(), catchError(this.handleError) );
  }

  pausePlayback() {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/player/pause';
    return this.http.put<any>(spotifyEndpoint, null, this.getOptions()).pipe( tap(), catchError(this.handleError) );
  }

  resumePlayback() {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/player/play';
    return this.http.put<any>(spotifyEndpoint, null, this.getOptions()).pipe( tap(), catchError(this.handleError) );
  }

  spotifyAuthorize() {
    localStorage.setItem('redirect', window.location.href);
    window.open(localStorage.getItem('spotifyUrlAuthorize'), '_blank');
  }

  getOptions() {
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.getToken()
      })
    };
  }

  getToken() {
    if ((localStorage.getItem('token') == null || localStorage.getItem('token') === undefined) &&
      localStorage.getItem('gettingthetoken') !== '1') {
      setInterval(() =>  {
        if (localStorage.getItem('token') !== null && localStorage.getItem('token') !== undefined) {
          setTimeout(() => {
            // TODO: Uncomment if deployed outside netlify
            // const redirectUrl = localStorage.getItem('redirect');
            // if (redirectUrl) window.location.href = redirectUrl;
            // window.location.reload();
            window.location.href = "/";
          }, 200);
        }
      }, 400);
      localStorage.setItem('gettingthetoken', '1');
      window.open(localStorage.getItem('spotifyUrlAuthorize'), '_blank');
    }
    return localStorage.getItem('token');
  }

  private handleError(err: HttpErrorResponse) {
    const errorMessage = err.error instanceof ErrorEvent ?
      `An error occurred: ${err.error.message}` :
      `Server returned code: ${err.status}, error message is: ${err.message}`;

    if (localStorage.getItem('hasDevices') !== '1' && err.status == 404) {
      if (localStorage.getItem('popupsBlocked') !== '1'
        && confirm('No available devices to play to. Open spotify online?\nError message: ' + err.message)) {
        if (localStorage.getItem('popupsBlocked') !== '0') {
          const spotifyWin = window.open('https://open.spotify.com', '_blank');
          if (!spotifyWin || spotifyWin.closed || typeof spotifyWin.closed === 'undefined') {
            localStorage.setItem('popupsBlocked', '1');
          } else {
            localStorage.setItem('popupsBlocked', '0');
          }
        } else {
          alert('Popups are being blocked!');
        }
      }
    } else if (localStorage.getItem('gettingthetoken') !== '1'
      && localStorage.getItem('popupsBlocked') !== '1'
      && (confirm('There has been an error.\nMessage: ' + err.message + '\nTry to reauthorize?'))) {
      localStorage.clear();
      localStorage.setItem('redirect', window.location.href);
      const watchToken = setInterval(() => {
        if (localStorage.getItem('token') !== null && localStorage.getItem('token') !== undefined) {
          setTimeout(() => {
            window.location.href = localStorage.getItem('redirect');
            clearInterval(watchToken);
          }, 500);
        }
      }, 1000);
      localStorage.setItem('gettingthetoken', '1');
      if (localStorage.getItem('popupsBlocked') !== '0') {
        const authWin = window.open(localStorage.getItem('spotifyUrlAuthorize'), '_blank');
        if (!authWin || authWin.closed || typeof authWin.closed === 'undefined') {
          localStorage.setItem('popupsBlocked', '1');
        } else {
          localStorage.setItem('popupsBlocked', '0');
        }
      } else {
        alert('Popups are being blocked!');
      }
    }

    return throwError(errorMessage);
  }

}
