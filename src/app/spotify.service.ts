import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  constructor(private http: HttpClient, private globalService: GlobalService) {
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
    this.globalService.spotifyAuthUrl = uri;
  }

  search(query: string, searchBy?: string, limit?: number, searchWhat?: string): Observable<any> {
    const spotifyEndpoint = 'https://api.spotify.com/v1/search' +
      '?q=' + (searchBy ? searchBy + ':' : '') + encodeURIComponent(query) +
      '&type=' + encodeURIComponent(searchWhat || 'track') + '&limit=' + (limit || 50);
    return this.http.get<any>(spotifyEndpoint, this.getOptions())
      .pipe( tap(), catchError((err, caught) => this.handleError(err, caught)));
  }

  getPlaylist(id: string) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/playlists/' + id;
    return this.http.get<any>(spotifyEndpoint, this.getOptions())
      .pipe( tap(), catchError((err, caught) => this.handleError(err, caught)));
  }

  getPlaylistTracks(id: string, offset?: number) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/playlists/' + id + '/tracks' + '?offset=' + (offset || 0);
    return this.http.get<any>(spotifyEndpoint, this.getOptions())
      .pipe( tap(), catchError((err, caught) => this.handleError(err, caught)));
  }

  createPlaylist(name: string, pub: boolean, description: string) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/playlists';
    return this.http.post<any>(spotifyEndpoint, { name, public: pub, description }, this.getOptions())
      .pipe( tap(), catchError((err, caught) => this.handleError(err, caught)));
  }

  replaceTracksToPlaylist(id: string, uris: string[]) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/playlists/' + id + '/tracks';
    return this.http.put<any>(spotifyEndpoint, { uris }, this.getOptions())
      .pipe( tap(), catchError((err, caught) => this.handleError(err, caught)));
  }

  addTracksToPlaylist(id: string, uris: string[], position?: number) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/playlists/' + id + '/tracks';
    return this.http.post<any>(spotifyEndpoint, { uris, position }, this.getOptions())
      .pipe( tap(), catchError((err, caught) => this.handleError(err, caught)));
  }

  getArtist(id: string) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/artists/' + id;
    return this.http.get<any>(spotifyEndpoint, this.getOptions())
      .pipe( tap(), catchError((err, caught) => this.handleError(err, caught)));
  }

  getArtistTopTracks(id: string) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/artists/' + id + '/top-tracks?country=PH';
    return this.http.get<any>(spotifyEndpoint, this.getOptions())
      .pipe( tap(), catchError((err, caught) => this.handleError(err, caught)));
  }

  getArtistAlbums(id: string) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/artists/' + id + '/albums?market=PH';
    return this.http.get<any>(spotifyEndpoint, this.getOptions())
      .pipe( tap(), catchError((err, caught) => this.handleError(err, caught)));
  }

  getAlbum(id: string) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/albums/' + id;
    return this.http.get<any>(spotifyEndpoint, this.getOptions())
      .pipe( tap(), catchError((err, caught) => this.handleError(err, caught)));
  }

  getAlbumTracks(id: string) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/albums/' + id + '/tracks?limit=50';
    return this.http.get<any>(spotifyEndpoint, this.getOptions())
      .pipe( tap(), catchError((err, caught) => this.handleError(err, caught)));
  }

  getNewReleases(limit?: number) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/browse/new-releases?limit=' + (limit || 50);
    return this.http.get<any>(spotifyEndpoint, this.getOptions())
      .pipe( tap(), catchError((err, caught) => this.handleError(err, caught)));
  }

  getFeaturedPlaylists(limit?: number) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/browse/featured-playlists?limit=' + (limit || 50);
    return this.http.get<any>(spotifyEndpoint, this.getOptions())
      .pipe( tap(), catchError((err, caught) => this.handleError(err, caught)));
  }

  getUser(id?: string) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/' + (id ? 'users/' + id : 'me');
    return this.http.get<any>(spotifyEndpoint, this.getOptions())
      .pipe( tap(), catchError((err, caught) => this.handleError(err, caught)));
  }

  getUserPlaylists(id?: string, offset?: number, limit?: number) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/' + (id ? 'users/' + id : 'me')
      + '/playlists?limit=' + (limit || 50)
      + '&offset=' + (offset || 0);
    return this.http.get<any>(spotifyEndpoint, this.getOptions())
      .pipe( tap(), catchError((err, caught) => this.handleError(err, caught)));
  }

  getUserTopTracks(limit?: number, timeRange?: string) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/top/tracks?limit=' + (limit || 50) +
      (timeRange ? '&time_range=' + timeRange : '&time_range=long_term');
    return this.http.get<any>(spotifyEndpoint, this.getOptions())
      .pipe( tap(), catchError((err, caught) => this.handleError(err, caught)));
  }

  getUserTopArtists(limit?: number, timeRange?: string) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/top/artists?limit=' + (limit || 50) +
      (timeRange ? '&time_range=' + timeRange : '&time_range=long_term');
    return this.http.get<any>(spotifyEndpoint, this.getOptions())
      .pipe( tap(), catchError((err, caught) => this.handleError(err, caught)));
  }

  getUserSavedTracks(limit?: number) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/tracks?limit=' + (limit || 50);
    return this.http.get<any>(spotifyEndpoint, this.getOptions())
      .pipe( tap(), catchError((err, caught) => this.handleError(err, caught)));
  }

  savedTrack(id: string) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/tracks?ids=' + id;
    return this.http.put<any>(spotifyEndpoint, null, this.getOptions())
      .pipe( tap(), catchError((err, caught) => this.handleError(err, caught)));
  }

  removeTrack(id: string) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/tracks?ids=' + id;
    return this.http.delete<any>(spotifyEndpoint, this.getOptions())
      .pipe( tap(), catchError((err, caught) => this.handleError(err, caught)));
  }

  getRecentlyPlayed(limit?: number) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/player/recently-played?limit=' + (limit || 50);
    return this.http.get<any>(spotifyEndpoint, this.getOptions())
      .pipe( tap(), catchError((err, caught) => this.handleError(err, caught)));
  }

  getCurrentPlayback() {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/player';
    return this.http.get<any>(spotifyEndpoint, this.getOptions())
      .pipe( tap(), catchError((err, caught) => this.handleError(err, caught)));
  }

  getDevices() {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/player/devices';
    return this.http.get<any>(spotifyEndpoint, this.getOptions())
      .pipe( tap(), catchError((err, caught) => this.handleError(err, caught)));
  }

  playToDevice(deviceIds: string, transferOnly?: boolean) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/player';
    const data = { device_ids: [deviceIds], play: (transferOnly === true ? false : true) };
    return this.http.put<any>(spotifyEndpoint, data, this.getOptions())
      .pipe( tap(), catchError((err, caught) => this.handleError(err, caught)));
  }

  playTrack(contextUri?: string, uris?: string[], offset?: string) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/player/play';
    const data = { context_uri: contextUri, uris, offset: (offset ? { uri: offset } : null) };
    return this.http.put<any>(spotifyEndpoint, data, this.getOptions())
      .pipe( tap(), catchError((err, caught) => this.handleError(err, caught)));
  }

  setRepeatMode(state: string) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/player/repeat?state=' + state;
    return this.http.put<any>(spotifyEndpoint, null, this.getOptions())
      .pipe( tap(), catchError((err, caught) => this.handleError(err, caught)));
  }

  toggleShuffle(state: boolean) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/player/shuffle?state=' + state;
    return this.http.put<any>(spotifyEndpoint, null, this.getOptions())
      .pipe( tap(), catchError((err, caught) => this.handleError(err, caught)));
  }

  skipToPreviousTrack() {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/player/previous';
    return this.http.post<any>(spotifyEndpoint, null, this.getOptions())
      .pipe( tap(), catchError((err, caught) => this.handleError(err, caught)));
  }

  skipToNextTrack() {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/player/next';
    return this.http.post<any>(spotifyEndpoint, null, this.getOptions())
      .pipe( tap(), catchError((err, caught) => this.handleError(err, caught)));
  }

  seek(position: number) {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/player/seek?position_ms=' + Math.floor(position);
    return this.http.put<any>(spotifyEndpoint, null, this.getOptions())
      .pipe( tap(), catchError((err, caught) => this.handleError(err, caught)));
  }

  pausePlayback() {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/player/pause';
    return this.http.put<any>(spotifyEndpoint, null, this.getOptions())
      .pipe( tap(), catchError((err, caught) => this.handleError(err, caught)));
  }

  resumePlayback() {
    const spotifyEndpoint = 'https://api.spotify.com/v1/me/player/play';
    return this.http.put<any>(spotifyEndpoint, null, this.getOptions())
      .pipe( tap(), catchError((err, caught) => this.handleError(err, caught)));
  }

  getOptions() {
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.getToken()
      })
    };
  }

  getToken() {
    const hasToken = !!localStorage.getItem('token');
    const isGettingToken = localStorage.getItem('gettingthetoken') == '1';
    if (hasToken) {
      return localStorage.getItem('token');
    } else if (!isGettingToken) {
      setTimeout(() => {
        localStorage.setItem('allowIntegration', '0');
        const message = 'If this is your first time, click reauthorize to sign in with spotify.';
        this.dispatch('openErrorUnknownDialog', { message });
      }, 0);
      return null;
    }
  }

  watchToken() {
    const watchToken = setInterval(() => {
      if (localStorage.getItem('token')) {
        window.location.reload();
        clearInterval(watchToken);
      }
    }, 200);
  }

  dispatch(name: string, detail?: any) {
    document.body.dispatchEvent(new CustomEvent(name, { detail }));
  }

  private handleError(err: HttpErrorResponse, caught?: any) {
    const errorMessage = err.error instanceof ErrorEvent ?
      `An error occurred: ${err.error.message}` :
      `Server returned code: ${err.status}, error message is: ${err.message}`;

    const hasNoOpenedDevice = this.globalService && !this.globalService.hasDevices && err.status == 404;
    const isGettingToken = localStorage.getItem('gettingthetoken') == '1';

    if (hasNoOpenedDevice) this.dispatch('openNoDeviceDialog');
    else if (!isGettingToken) this.dispatch('openErrorUnknownDialog', { message: 'Message: ' + err.message });

    return throwError(errorMessage);
  }

}
