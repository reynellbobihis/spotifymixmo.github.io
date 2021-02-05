import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../spotify.service';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})
export class SongsComponent implements OnInit {
  favoriteTracks: any;
  uris: any[];

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit() {
    this.getUserSavedTracks(30);
  }

  getUserSavedTracks(limit: number) {
    this.spotifyService.getUserSavedTracks(limit).subscribe(
      result => {
        this.favoriteTracks = result;
        const newArray = [];
        result.items.forEach(item => { newArray.push(item.track.uri); });
        this.uris = newArray;
      }
    );
  }

}
