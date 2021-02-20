import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private _currentTrackId: string;
  private _favoriteTracks: any;
  private _hasDevices: boolean;
  private _playback: any;
  private _playlists: any;
  private _refreshList: string[];

  constructor() { }

  set currentTrackId(val) { this._currentTrackId = val; }
  get currentTrackId() { return this._currentTrackId; }

  set favoriteTracks(val) { this._favoriteTracks = val; }
  get favoriteTracks() { return this._favoriteTracks; }

  set hasDevices(val) { this._hasDevices = val; }
  get hasDevices() { return this._hasDevices; }

  set playback(val) { this._playback = val; }
  get playback() { return this._playback; }

  set playlists(val) { this._playlists = val; }
  get playlists() { return this._playlists; }

  set refreshList(val) { this._refreshList = val; }
  get refreshList() { return this._refreshList; }

}
