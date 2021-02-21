import { Component, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { GlobalService } from './global.service';
import { SpotifyService } from './spotify.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent  {
  dialogRef: any;
  errorUnknownMessage: string;
  spotifyAuthUrl: string;
  @ViewChildren('errorUnknownDialogTemplate') errorUnknownDialog;
  @ViewChildren('noDeviceDialogTemplate') noDeviceDialog;

  constructor(private router: Router, private dialog: MatDialog, private spotifyService: SpotifyService, private globalService: GlobalService) {}

  ngOnInit() {
    this.spotifyAuthUrl = this.globalService.spotifyAuthUrl;
    document.body.addEventListener('openErrorUnknownDialog', (e) => this.openErrorUnknownDialog(e));
    document.body.addEventListener('openNoDeviceDialog', () => this.openNoDeviceDialog());
  }

  closeMenu() {
    document.body.classList.remove('mobile-menu-active');
  }

  reauthorize() {
    localStorage.clear();
    localStorage.setItem('gettingthetoken', '1');
    this.spotifyService.watchToken();
  }

  openErrorUnknownDialog(e: any) {
    if (!this.dialogRef && !this.router.url.includes('/#access_token')) {
      this.errorUnknownMessage = e.detail.message;
      this.dialogRef = this.dialog.open(this.errorUnknownDialog.toArray()[0], {
        width: '400px',
        autoFocus: false,
      });
      this.dialogRef.afterClosed().subscribe(() => {
        console.log('errorUnknownDialog closed');
      });
    }
  }

  openNoDeviceDialog() {
    this.dialogRef = this.dialog.open(this.noDeviceDialog.toArray()[0], {
      width: '400px',
      autoFocus: false,
    });
    this.dialogRef.afterClosed().subscribe(() => {
      console.log('noDeviceDialog closed');
    });
  }
}
