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
      result => {
        const albums = [];
        const titles = [];
        result.items.forEach(album => {
          if (!titles.includes(album.name)) albums.push(album);
          titles.push(album.name);
        });
        this.artistAlbums = {
          ...result,
          items: albums,
        };
      }
    );
  }
}
