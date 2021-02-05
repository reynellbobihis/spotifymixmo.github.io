import { Component, OnInit, Input } from '@angular/core';
import { SpotifyService } from '../../spotify.service';
import { GlobalService } from '../../global.service';

@Component({
  selector: 'app-tracks-list',
  templateUrl: './tracks-list.component.html',
  styleUrls: ['./tracks-list.component.scss']
})
export class TracksListComponent implements OnInit {
  playlist: any;
  currentTrackId: any;
  favoriteTracks: any;
  justClicked = false;
  @Input() tracks: any[];
  @Input() contextUri: any;
  @Input() uris: any;
  @Input() hideAlbums: any;
  @Input() hideArtists: any;
  @Input() hideOptions: any;
  @Input() class: any;

  constructor(private spotifyService: SpotifyService, private globalService: GlobalService) { }

  ngOnInit() {
    this.globalService.currentTrackIdValue.subscribe(
      result => { this.currentTrackId = result; }
    );
    this.globalService.favoriteTracksValue.subscribe(
      result => { this.favoriteTracks = result; }
    );
    // const dropdowns = document.querySelectorAll('.dropdown-menu [data-toggle="dropdown"]');
    // dropdowns.forEach(dropdown => {
    //   dropdown.addEventListener('click', event => {
    //     event.preventDefault();
    //     event.stopPropagation();
    //     const element = event.target as unknown as HTMLElement;
    //     element.nextElementSibling.classList.toggle('show');
    //   });
    // });
  }

  playTrack(contextUri?: string, uris?: string[], offset?: string) {
    // this.spotifyService.createPlaylist('$ _Playback').subscribe();
    this.spotifyService.playTrack(contextUri, uris, offset).subscribe();
  }

  msToTime(timeInMS: number): string {
    const timeInS = Math.floor(timeInMS / 1000);
    const minutes = Math.floor(timeInS / 60);
    const seconds = timeInS - (minutes * 60);
    return minutes + ':' + (seconds < 10 ? '0' + seconds : seconds);
  }

  getItem(item: any): any {
    return (item && item.track) ? item.track : item;
  }

  rowClick(contextUri?: string, uris?: string[], offset?: string) {

    if (this.justClicked === true) {
      this.playTrack(contextUri, uris, offset);
      // console.log('two clicks');
    } else {
      this.justClicked = true;
      setTimeout(() => {
        this.justClicked = false;
      }, 300);
    }

  }

  select(event) {
    if (event.target.tagName === 'TD') {
      const row = event.target.parentElement;
      const checkbox = row.querySelectorAll('.track-checkbox input[type=checkbox]')[0];
      if (checkbox.checked) {
        row.classList.remove('checked');
        checkbox.checked = false;
      } else {
        checkbox.checked = true;
        row.classList.add('checked');
      }
      if (row.parentElement.querySelectorAll('tr.checked').length > 0) {
        row.parentElement.parentElement.classList.add('has-selection');
      } else {
        row.parentElement.parentElement.classList.remove('has-selection');
      }
    }
  }

  stopPropagation(event) {
    event.stopPropagation();
  }

  searchIdFromFavorites(id: number): boolean {
    return (this.favoriteTracks && this.favoriteTracks.indexOf('"' + id + '"') >= 0);
  }

  savedTrack(id: string) {
    this.spotifyService.savedTrack(id).subscribe();
  }

  removeTrack(id: string) {
    this.spotifyService.removeTrack(id).subscribe();
  }

}
