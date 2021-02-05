import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../../spotify.service';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.scss']
})
export class ArtistComponent implements OnInit {
  artist: any;
  artistTopTracks: any;
  uris: any[];

  constructor(private activatedRoute: ActivatedRoute, private spotifyService: SpotifyService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.getArtist(params.id);
      this.getArtistTopTracks(params.id);
    });
  }

  getArtist(id: string) {
    this.spotifyService.getArtist(id).subscribe(
      result => { this.artist = result; }
    );
  }

  getArtistTopTracks(id: string) {
    this.spotifyService.getArtistTopTracks(id).subscribe(
      result => {
        this.artistTopTracks = result;
        const newArray = [];
        result.tracks.forEach(item => { newArray.push(item.uri); });
        this.uris = newArray;
      }
    );
  }

}
