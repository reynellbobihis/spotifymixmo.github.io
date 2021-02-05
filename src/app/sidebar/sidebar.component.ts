import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  playlists: any;

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit() {
    this.getUserPlaylists(0);
  }

  getUserPlaylists(offset) {
    this.spotifyService.getUserPlaylists(null, offset, 50).subscribe(result => {
      this.playlists = this.playlists ? this.playlists.concat(result.items) : result.items;
      if (result.items.length % 50 == 0) {
        this.getUserPlaylists(offset + 50);
      }
    });
  }
}
