import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../spotify.service';

@Component({
  selector: 'app-new-releases',
  templateUrl: './new-releases.component.html',
  styleUrls: ['./new-releases.component.scss']
})
export class NewReleasesComponent implements OnInit {
  newReleases: any;

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit() {
    this.spotifyService.getNewReleases().subscribe(
      result => { this.newReleases = result; }
    );
  }

  playTrack(contextUri?: string, uris?: string[], offset?: string) {
    this.spotifyService.playTrack(contextUri, uris, offset).subscribe();
  }

}
