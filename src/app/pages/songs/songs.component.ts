import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})
export class SongsComponent implements OnInit {
  favoriteTracks: any;
  uris: string[];

  constructor(private globalService: GlobalService) { }

  ngOnInit() {
    setInterval(() => {
      if (JSON.stringify(this.favoriteTracks) !== JSON.stringify(this.globalService.favoriteTracks)) {
        this.uris = [];
        this.favoriteTracks = this.globalService.favoriteTracks;
        this.favoriteTracks.map(item => this.uris.push(item.track.uri));
      }
    }, 500);
  }
}
