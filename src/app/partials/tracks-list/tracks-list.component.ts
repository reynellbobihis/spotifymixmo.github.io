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
  currentTrackId: string;
  favoriteTracks: any;
  justClicked = false;
  isAllSelected = false;
  @Input() tracks: any[];
  @Input() contextUri: any;
  @Input() uris: any;
  @Input() hideAlbums: any;
  @Input() hideArtists: any;
  @Input() hideOptions: any;
  @Input() class: any;

  constructor(private spotifyService: SpotifyService, private globalService: GlobalService) { }

  ngOnInit() {
    setInterval(() => {
      this.currentTrackId = this.globalService.currentTrackId;
      this.favoriteTracks = this.globalService.favoriteTracks;
    }, 500);

    // const dropdowns = document.querySelectorAll('.dropdown-menu [data-toggle="dropdown"]');
    // dropdowns.forEach(dropdown => {
    //   dropdown.addEventListener('click', event => {
    //     event.preventDefault();
    //     event.stopPropagation();
    //     const element = event.target as unknown as HTMLElement;
    //     element.nextElementSibling.classList.toggle('show');
    //   });
    // });
    window.oncontextmenu = (event: any) => {
      const row = event.target.closest('app-tracks-list tbody tr');
      if (row) {
        // event.preventDefault();
      }
    }
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

  rowClick(event: any, contextUri?: string, uris?: string[], offset?: string) {
    if (this.justClicked === true) { // double click
      this.justClicked = false;
      this.playTrack(contextUri, uris, offset);
    } else {
      this.justClicked = true;
      setTimeout(() => { // single click
        if (event.target.tagName === 'TD' && this.justClicked) {
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
        this.justClicked = false;
      }, 250);
    }
  }

  selectAllToggle(event) {
    const table = event.target.closest('table');
    const rows = table.querySelectorAll('tbody tr');
    [ ...rows ].forEach(row => {
      if (this.isAllSelected) row.classList.remove('checked');
      else row.classList.add('checked');
      const checkbox = row.querySelectorAll('.track-checkbox input[type=checkbox]')[0];
      checkbox.checked = !this.isAllSelected;
    });
    if (this.isAllSelected) table.classList.remove('has-selection');
    else table.classList.add('has-selection');
    this.isAllSelected = !this.isAllSelected;
  }

  shareOnFacebook(link) {
    window.open(
      'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(link), 
      'facebook-share-dialog', 
      'width=626,height=436'); 
    return false;
  }

  stopPropagation(event) {
    event.stopPropagation();
  }

  searchIdFromFavorites(id: string): boolean {
    return (this.favoriteTracks && JSON.stringify(this.favoriteTracks).indexOf(id) >= 0);
  }

  savedTrack(id: string) {
    this.spotifyService.savedTrack(id).subscribe();
  }

  removeTrack(id: string) {
    this.spotifyService.removeTrack(id).subscribe();
  }

}
