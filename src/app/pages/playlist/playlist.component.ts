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
  currentTrackId: any;

  constructor(private activatedRoute: ActivatedRoute, private spotifyService: SpotifyService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.playlist = null;
      this.spotifyService.getPlaylist(params.id).subscribe(
        result => { this.playlist = result; console.log(result.tracks.items); }
      );
      // this.getPlaylistTracks(params.id, 0);
    });
  }

  // getPlaylistTracks(id, offset) {
  //   this.spotifyService.getPlaylistTracks(id, offset).subscribe(result => {
  //     this.playlistTracks = this.playlistTracks ? this.playlistTracks.concat(result.tracks.items) : result.items;
  //     if (result.items.length % 100 == 0) {
  //       this.getPlaylistTracks(id, offset + 100);
  //     }
  //   });
  // }

}
