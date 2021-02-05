import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../spotify.service';

@Component({
  selector: 'app-featured-artists',
  templateUrl: './featured-artists.component.html',
  styleUrls: ['./featured-artists.component.scss']
})
export class FeaturedArtistsComponent implements OnInit {
  topArtists: any;

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit() {
    this.spotifyService.getUserTopArtists(25, 'short_term').subscribe(
      result => { this.topArtists = result; }
    );
  }

}

