import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../spotify.service';
import { GlobalService } from '../../global.service';

@Component({
  selector: 'app-featured-tracks',
  templateUrl: './featured-tracks.component.html',
  styleUrls: ['./featured-tracks.component.scss']
})
export class FeaturedTracksComponent implements OnInit {
  featuredTracks: any;
  currentTrackId: string;
  uris: any[];

  constructor(private spotifyService: SpotifyService, private globalService: GlobalService) { }

  ngOnInit() {
    setInterval(() => {
      this.currentTrackId = this.globalService.playback.item.id;
    }, 500);

    this.spotifyService.getUserTopTracks(30, 'short_term').subscribe(
      result => {
        console.log(result.items);
        this.featuredTracks = result.items;
        const newArray = [];
        result.items.forEach(item => { newArray.push(item.uri); });
        this.uris = newArray;
      }
    );
  }

  playTrack(contextUri?: string, uris?: string[], offset?: string) {
    this.spotifyService.playTrack(contextUri, uris, offset).subscribe();
  }

}
