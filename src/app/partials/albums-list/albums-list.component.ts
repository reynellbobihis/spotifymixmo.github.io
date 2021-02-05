import { Component, OnInit, Input } from '@angular/core';
import { SpotifyService } from '../../spotify.service';

@Component({
  selector: 'app-albums-list',
  templateUrl: './albums-list.component.html',
  styleUrls: ['./albums-list.component.scss']
})
export class AlbumsListComponent implements OnInit {
  @Input() albums: any[];

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit() {
  }

  playTrack(contextUri?: string, uris?: string[], offset?: string) {
    this.spotifyService.playTrack(contextUri, uris, offset).subscribe();
  }

}