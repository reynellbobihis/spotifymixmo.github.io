import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../../spotify.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit {
  album: any;
  albumTracks: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private spotifyService: SpotifyService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.spotifyService.getAlbum(params.id).subscribe(result => this.album = result);
      this.spotifyService.getAlbumTracks(params.id).subscribe(
        result => { this.albumTracks = result; }
      );
    });
  }

}
