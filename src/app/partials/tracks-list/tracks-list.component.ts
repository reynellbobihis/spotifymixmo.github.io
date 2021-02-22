import { Component, OnInit, Input, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { SpotifyService } from '../../spotify.service';
import { GlobalService } from '../../global.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';

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
  _isAllSelected = false;
  lastSelectionIndex = 0;
  selectedRows: any[];
  menuX: number = 0;
  menuY: number = 0;
  displayedColumns: string[];
  selection: any;
  @Input() tracks: any[];
  @Input() contextUri: any;
  @Input() uris: any;
  @Input() hideAlbums: any;
  @Input() hideArtists: any;
  @Input() hideOptions: any;
  @Input() class: any;
  @ViewChildren(MatMenuTrigger) trackMenuTrigger: QueryList<MatMenuTrigger>;
  @ViewChildren('trackListTable') trackListTable: QueryList<any>;

  constructor(private spotifyService: SpotifyService, private globalService: GlobalService) {
    this.selection = new SelectionModel<any>(true, []);
  }

  ngOnInit() {
    setInterval(() => {
      const { playback } = this.globalService;
      this.currentTrackId = playback ? playback.item.id : '';
      if (!this.justClicked) this.favoriteTracks = this.globalService.favoriteTracks;
    }, 1000);

    window.oncontextmenu = (event: any) => {
      const row = event.target.closest('app-tracks-list tbody tr');
      if (row) {
        event.preventDefault();
        this.menuX = event.x;
        this.menuY = event.y;
        const menus = this.trackMenuTrigger.toArray();
        menus.forEach((menu, index) => { if (menu.menuOpened) menus[index].closeMenu(); });
        menus[row.rowIndex - 1].openMenu();
      }
    }
    window.addEventListener('click', () => {
      const menus = this.trackMenuTrigger.toArray();
      menus.forEach((menu, index) => { if (menu.menuOpened) menus[index].closeMenu(); });
    });
    window.addEventListener('resize', () => this.setDisplayedColumns());
  }

  ngAfterViewChecked() {
    if (!this.displayedColumns) this.setDisplayedColumns();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tracks.length;
    return numSelected == numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.tracks.forEach(row => this.selection.select(row));
  }

  setDisplayedColumns() {
    setTimeout(() => {
      const width = this.trackListTable.first._elementRef.nativeElement.offsetWidth;
      if (width < 768) this.displayedColumns = ['select', 'song', 'option'];
      else if (width < 992) this.displayedColumns = ['select', 'song', 'artist', 'option'];
      else if (width < 1200) this.displayedColumns = ['select', 'song', 'artist', 'album', 'option'];
      else this.displayedColumns = ['select', 'song', 'artist', 'album', 'popularity', 'time', 'option'];
    }, 100);
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
      if (this._isAllSelected) row.classList.remove('checked');
      else row.classList.add('checked');
      const checkbox = row.querySelector('.track-checkbox input');
      checkbox.checked = !this._isAllSelected;
    });
    if (this._isAllSelected) table.classList.remove('has-selection');
    else table.classList.add('has-selection');
    this._isAllSelected = !this._isAllSelected;
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
