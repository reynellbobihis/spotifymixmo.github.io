import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../../spotify.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchQuery: string;
  tracks: any;
  uris: any;
  artists: any;
  albums: any;
  playlists: any;

  constructor(private activatedRoute: ActivatedRoute, private spotifyService: SpotifyService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.searchQuery = params.query;
      this.spotifyService.search(this.searchQuery, null, 50, 'track').subscribe(
        result => {
          this.tracks = result.tracks.items;
          const newArray = [];
          result.tracks.items.forEach(item => { newArray.push(item.uri); });
          this.uris = newArray;
        }
      );
      this.spotifyService.search(this.searchQuery, null, 50, 'artist').subscribe(
        result => { this.artists = result.artists.items; }
      );
      this.spotifyService.search(this.searchQuery, null, 50, 'album').subscribe(
        result => { this.albums = result.albums.items; }
      );
      this.spotifyService.search(this.searchQuery, null, 50, 'playlist').subscribe(
        result => { this.playlists = result.playlists.items; }
      );
    });
    
    [].forEach.call(document.getElementsByClassName('tabs-item'), function (item) {
      item.addEventListener('click', function(){
        item.closest('.tabs').querySelector('.tabs-content > div.active').classList.remove('active');
        item.closest('.tabs').querySelector(item.getAttribute('data-target')).classList.add('active');
        item.closest('.tabs').querySelector('.tabs-item.active').classList.remove('active');
        item.classList.add('active');
      }, false);
    });
  }

}