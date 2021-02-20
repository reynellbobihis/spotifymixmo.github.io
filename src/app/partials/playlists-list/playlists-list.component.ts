import { Component, OnInit, Input } from '@angular/core';
import { SpotifyService } from '../../spotify.service';

@Component({
  selector: 'app-playlists-list',
  templateUrl: './playlists-list.component.html',
  styleUrls: ['./playlists-list.component.scss']
})
export class PlaylistsListComponent implements OnInit {
  @Input() playlists: any[];
  @Input() hidden: string[];

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit() {
  }

  playTrack(contextUri?: string, uris?: string[], offset?: string) {
    this.spotifyService.playTrack(contextUri, uris, offset).subscribe();
  }

}