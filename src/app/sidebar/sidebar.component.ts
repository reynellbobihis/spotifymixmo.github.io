import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  playlists: any;

  constructor(private spotifyService: SpotifyService, private globalService: GlobalService) { }

  ngOnInit() {
    this.getUserPlaylists();
  }

  getUserPlaylists(offset?: number) {
    this.spotifyService.getUserPlaylists(null, offset || 0, 50).subscribe(result => {
      this.playlists = this.playlists ? this.playlists.concat(result.items) : result.items;
      this.globalService.playlists = this.playlists;
      if (result.items.length % 50 == 0) {
        // setTimeout(() => this.getUserPlaylists(offset + 50), 2000);
      }
    });
  }
}
