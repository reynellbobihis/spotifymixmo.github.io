import { Component, OnInit, Input } from '@angular/core';
import { SpotifyService } from '../../spotify.service';

@Component({
  selector: 'app-artist-albums',
  templateUrl: './artist-albums.component.html',
  styleUrls: ['./artist-albums.component.scss']
})
export class ArtistAlbumsComponent implements OnInit {
  artistAlbums: any;
  @Input() artistId: any;

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit() {
    this.getArtistAlbums(this.artistId);
  }

  getArtistAlbums(artistId: string) {
    this.spotifyService.getArtistAlbums(artistId).subscribe(
      result => { this.artistAlbums = result; }
    );
  }

}
