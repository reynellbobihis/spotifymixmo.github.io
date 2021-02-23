import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
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
  playlists: any;
  currentTrackId: string;
  favoriteTracks: any;
  justClicked = false;
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

  constructor(private spotifyService: SpotifyService, private globalService: GlobalService) {
    this.selection = new SelectionModel<any>(true, []);
  }

  ngOnInit() {
    this.watchPlayback();
    window.oncontextmenu = (event: any) => this.showMenu(event);
    // document.body.addEventListener('click', (e) => this.closeAllMenus(e));
    window.addEventListener('resize', () => this.setDisplayedColumns());
    this.setDisplayedColumns();
  }

  showMenu(event: any) {
    const isValidTarget = event.target.tagName == 'TD';
    const row = event.target.closest('app-tracks-list tbody tr');
    if (row && isValidTarget) {
      event.preventDefault();
      this.menuX = event.x - 10;
      this.menuY = event.y;
      // this.closeAllMenus(event);
      row.querySelector('.trackMenuTrigger').click();
      this.watchPlaylists();
    }
  }

  watchPlaylists() {
    const { playlists } = this.globalService;
    if (playlists) this.playlists = playlists;
    else setTimeout(() => this.watchPlaylists(), 1000);
  }

  watchPlayback() {
    const { playback } = this.globalService;
    this.currentTrackId = playback ? playback.item.id : '';
    if (!this.justClicked) this.favoriteTracks = this.globalService.favoriteTracks;
    setTimeout(() => this.watchPlayback(), 1000);
  }

  // closeAllMenus(e: any) {
  //   const isMenuTrigger = !!e.target.closest('.mat-menu-trigger');
  //   console.log(isMenuTrigger);
  //   if (!isMenuTrigger) {
  //     const menus = this.trackMenuTrigger.toArray();
  //     menus.forEach((menu, index) => { if (menu.menuOpened) menus[index].closeMenu(); });
  //   }
  // }

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
    const width = window.outerWidth;
    if (width < 768) this.displayedColumns = ['select', 'number', 'song', 'option'];
    else if (width < 992) this.displayedColumns = ['select', 'number', 'song', 'artist', 'option'];
    else if (width < 1200) this.displayedColumns = ['select', 'number', 'song', 'artist', 'album', 'option'];
    else this.displayedColumns = ['select', 'number', 'song', 'artist', 'album', 'time', 'option'];

    const hideOptions = this.hideOptions && this.displayedColumns.indexOf('option') !== -1;
    if (hideOptions) this.displayedColumns.splice(this.displayedColumns.indexOf('option'), 1);

    const hideArtists = this.hideArtists && this.displayedColumns.indexOf('artist') !== -1;
    if (hideArtists) this.displayedColumns.splice(this.displayedColumns.indexOf('artist'), 1);

    const hideAlbums = this.hideAlbums && this.displayedColumns.indexOf('album') !== -1;
    if (hideAlbums) this.displayedColumns.splice(this.displayedColumns.indexOf('album'), 1);
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

  rowClick(item: any, event: any, contextUri?: string, uris?: string[], offset?: string) {
    const { target, shiftKey } = event;
    if (this.justClicked) { // double click
      this.justClicked = false;
      this.playTrack(contextUri, uris, offset);
    } else {
      this.justClicked = true;
      setTimeout(() => { // single click
        if (target.tagName === 'TD' && this.justClicked) {
          this.selection.toggle(item);

          if (shiftKey && this.selection.isSelected(item)) { // Multi select
            const index = this.tracks.indexOf(item);
            const fromIndex = Math.min(this.lastSelectionIndex, index);
            const toIndex = Math.max(this.lastSelectionIndex, index);

            for (let index = fromIndex; index <= toIndex; index++) {
              if (!this.selection.isSelected(this.tracks[index])) {
                this.selection.toggle(this.tracks[index]);
              }
            }
          }
          this.lastSelectionIndex = this.tracks.indexOf(item);
        }
        this.justClicked = false;
      }, 200);
    }
  }

  shareOnFacebook(link) {
    window.open(
      'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(link), 
      'facebook-share-dialog', 
      'width=626,height=436');
  }

  isFavorite(id: string): boolean {
    return (this.favoriteTracks && JSON.stringify(this.favoriteTracks).indexOf(id) >= 0);
  }

  toggleFavorite(id: string) {
    if (this.isFavorite(id)) this.spotifyService.removeTrack(id).subscribe();
    else this.spotifyService.savedTrack(id).subscribe();
  }
}
