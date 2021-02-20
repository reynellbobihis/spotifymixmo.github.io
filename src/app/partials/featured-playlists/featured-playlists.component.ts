import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../spotify.service';

@Component({
  selector: 'app-featured-playlists',
  templateUrl: './featured-playlists.component.html',
  styleUrls: ['./featured-playlists.component.scss']
})
export class FeaturedPlaylistsComponent implements OnInit {
  featuredPlaylists: any;

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit() {
    this.spotifyService.getFeaturedPlaylists(50).subscribe(
      result => { this.featuredPlaylists = result.playlists.items; }
    );
  }
}
