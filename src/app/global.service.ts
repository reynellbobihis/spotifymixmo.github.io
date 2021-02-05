import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  currentTrackIdValue = new Subject();
  favoriteTracksValue = new Subject();

  constructor() { }

  set currentTrackId(value) {
    this.currentTrackIdValue.next(value);
    localStorage.setItem('currentTrackId', value);
  }
  get currentTrackId() {
    return localStorage.getItem('currentTrackId');
  }

  set favoriteTracks(value) {
    this.favoriteTracksValue.next(value);
    localStorage.setItem('favoriteTracks', value);
  }
  get favoriteTracks() {
    return localStorage.getItem('favoriteTracks');
  }

}
