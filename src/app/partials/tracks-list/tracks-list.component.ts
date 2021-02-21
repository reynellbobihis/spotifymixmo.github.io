import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { SpotifyService } from '../../spotify.service';
import { GlobalService } from '../../global.service';
import { MatMenuTrigger } from '@angular/material/menu';

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
  lastSelectionIndex = 0;
  @Input() tracks: any[];
  @Input() contextUri: any;
  @Input() uris: any;
  @Input() hideAlbums: any;
  @Input() hideArtists: any;
  @Input() hideOptions: any;
  @Input() class: any;
  @ViewChildren(MatMenuTrigger) trackMenuTrigger: QueryList<MatMenuTrigger>;

  constructor(private spotifyService: SpotifyService, private globalService: GlobalService) { }

  ngOnInit() {
    setInterval(() => {
      const { playback } = this.globalService;
      this.currentTrackId = playback ? playback.item.id : '';
      this.favoriteTracks = this.globalService.favoriteTracks;
    }, 500);

    window.oncontextmenu = (event: any) => {
      const row = event.target.closest('app-tracks-list tbody tr');
      if (row) {
        event.preventDefault();
        this.trackMenuTrigger.toArray()[row.rowIndex - 1].openMenu();
      }
    }
  }

  playTrack(contextUri?: string, uris?: string[], offset?: string) {
    console.log('contextUri, uris, offset', contextUri, uris, offset);
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
    const { target, shiftKey } = event;
    if (this.justClicked) { // double click
      this.justClicked = false;
      this.playTrack(contextUri, uris, offset);
    } else {
      this.justClicked = true;
      setTimeout(() => { // single click
        if (target.tagName === 'TD' && this.justClicked) {
          const row = target.parentElement;
          const table = row.parentElement.parentElement;
          const checkbox = row.querySelector('.track-checkbox input');

          if (checkbox.checked) row.classList.remove('checked');
          else {
            row.classList.add('checked');
            if (shiftKey) this.selectRows(table, this.lastSelectionIndex, row.rowIndex);
            this.lastSelectionIndex = row.rowIndex;
          }
          checkbox.checked = !checkbox.checked;

          this.refreshTable(table);
        }
        this.justClicked = false;
      }, 200);
    }
  }

  refreshTable(table: any) {
    const { length } = table.querySelectorAll('tbody tr.checked');
    if (length > 0) table.classList.add('has-selection');
    else table.classList.remove('has-selection');
  }

  selectRows(table: any, fromIndex: number, toIndex?: number) {
    const _fromIndex = Math.min(fromIndex, toIndex || fromIndex);
    const _toIndex = Math.max(fromIndex, toIndex || fromIndex);

    for (let index = _fromIndex; index <= _toIndex; index++) {
      const row = table.querySelector(`tbody tr:nth-of-type(${index})`);
      row.classList.add('checked');
    }
  }

  selectAllToggle(event) {
    const table = event.target.closest('table');
    const rows = table.querySelectorAll('tbody tr');
    [ ...rows ].forEach(row => {
      if (this.isAllSelected) row.classList.remove('checked');
      else row.classList.add('checked');
      const checkbox = row.querySelector('.track-checkbox input');
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
