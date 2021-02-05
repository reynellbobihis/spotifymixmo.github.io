import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../spotify.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  tracks: any;
  uris: string[];
  currentTrack: any;

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit() {
    this.getCurrentPlayback();
    this.getRecentlyPlayed();
    setInterval(() => {
      this.getCurrentPlayback();
      this.getRecentlyPlayed();
    }, 3000);
  }

  getRecentlyPlayed() {
    this.spotifyService.getRecentlyPlayed(49).subscribe(
      result => {
        if (this.currentTrack) {
          result.items.unshift({ track: this.currentTrack });
        }
        this.tracks = result;
        const newArray = [];
        result.items.forEach(item => { newArray.push(item.track.uri); });
        this.uris = newArray;
      }
    );
  }

  getCurrentPlayback() {
    this.spotifyService.getCurrentPlayback().subscribe(
      result => {
        console.log('getCurrentPlayback function is running in recently played...');
        if (result) {
          this.currentTrack = result.item;
        }
      }
    );
  }

}
