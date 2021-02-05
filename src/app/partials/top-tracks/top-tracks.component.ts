import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../spotify.service';

@Component({
  selector: 'app-top-tracks',
  templateUrl: './top-tracks.component.html',
  styleUrls: ['./top-tracks.component.scss']
})
export class TopTracksComponent implements OnInit {
  topTracks: any;
  uris: any[];

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit() {
    this.spotifyService.getUserTopTracks(30, 'medium_term').subscribe(
      result => {
        this.topTracks = result;
        const newArray = [];
        result.items.forEach(item => { newArray.push(item.uri); });
        this.uris = newArray;
      }
    );
  }

  msToTime(timeInMS: number): string {
    const timeInS = Math.floor(timeInMS / 1000);
    const minutes = Math.floor(timeInS / 60);
    const seconds = timeInS - (minutes * 60);
    return minutes + ':' + (seconds < 10 ? '0' + seconds : seconds);
  }

}
