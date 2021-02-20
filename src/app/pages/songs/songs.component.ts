import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})
export class SongsComponent implements OnInit {
  favoriteTracks: any;
  uris: any[];

  constructor(private globalService: GlobalService) { }

  ngOnInit() {
    setInterval(() => {
      if (JSON.stringify(this.favoriteTracks) !== JSON.stringify(this.globalService.favoriteTracks)) {
        this.favoriteTracks = this.globalService.favoriteTracks;
      }
    }, 500);
  }
}
