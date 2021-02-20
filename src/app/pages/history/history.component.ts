import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/global.service';
import { SpotifyService } from '../../spotify.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  tracks: any;
  uris: string[];
  currentTrack: any;

  constructor(private router: Router, private spotifyService: SpotifyService, private globalService: GlobalService) { }

  ngOnInit() {
    const { playback = {} } = this.globalService;
    this.currentTrack = playback.item || false;
    this.getRecentlyPlayed();
    setInterval(() => {
      const isInHistory = this.router.url === '/history';
      const hasNoSelections = !document.querySelectorAll('app-tracks-list .has-selection').length;
      const hasNoShownDropdowns = !document.querySelectorAll('.mat-menu-panel.trackMenu').length;
      if (isInHistory && hasNoSelections && hasNoShownDropdowns) {
        this.currentTrack = this.globalService.playback.item;
        this.getRecentlyPlayed();
      }
    }, 2000);
  }

  getRecentlyPlayed() {
    this.spotifyService.getRecentlyPlayed(49).subscribe(
      result => {
        console.log('getRecentlyPlayed method is running in recently played...');
        if (this.currentTrack) {
          result.items.unshift({ track: this.currentTrack });
        }
        this.tracks = result;
        const newArray = [];
        result.items.forEach(item => { newArray.push(item.track.uri); });
        this.uris = newArray;
      }
    );
  }
}
