import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../../spotify.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit {
  playlist: any;
  playlistTracks: any[];

  constructor(private activatedRoute: ActivatedRoute, private spotifyService: SpotifyService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.playlist = null;
      this.spotifyService.getPlaylist(params.id).subscribe(
        result => {
          this.playlist = result;
          if (result.tracks.total > 100) this.getPlaylistTracks(params.id, 100);
        }
      );
    });
  }

  getPlaylistTracks(id: string, offset: number) {
    this.spotifyService.getPlaylistTracks(id, offset).subscribe(result => {
      this.playlist.tracks.items = [
        ...this.playlist.tracks.items,
        ...result.items,
      ];
      if (this.playlist.tracks.items.length !== result.total) {
        setTimeout(() => this.getPlaylistTracks(id, offset + 100), 200);
      }
    });
  }

}
