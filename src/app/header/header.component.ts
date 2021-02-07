import { Component, OnInit, HostListener } from '@angular/core';
import { SpotifyService } from '../spotify.service';
import { GlobalService } from '../global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  playback: any;
  backgroundColor = 'linear-gradient(to right, white 0%, #4C00D5 0%)';
  devices: any;
  user: any;
  hasActiveDevice: any;
  tracksFromContext: any;
  delay: boolean;
  integration = true;

  constructor(private spotifyService: SpotifyService, private globalService: GlobalService, private router: Router) { }

  ngOnInit() {

    localStorage.setItem('gettingthetoken', '0');
    this.getUser();
    this.getCurrentPlayback();
    this.getDevices();
    this.getTracksFromContext();
    this.getUserSavedTracks(50);
    localStorage.setItem('playbackContextUri', '');

    setInterval(() =>  {
      if (this.integration) {
        this.getCurrentPlayback();
        this.getDevices();
        if (this.playback && this.playback.context && localStorage.getItem('playbackContextUri') !== this.playback.context.uri) {
          this.getTracksFromContext();
          localStorage.setItem('playbackContextUri', this.playback.context.uri);
        }
        this.getUserSavedTracks(50);
      }
    }, 2000);

    // const dropdowns = document.querySelectorAll('.dropdown-menu [data-toggle="dropdown"]');
    // dropdowns.forEach(dropdown => {
    //   dropdown.addEventListener('click', event => {
    //     event.preventDefault();
    //     event.stopPropagation();
    //     const element = event.target.nextSibling as unknown as HTMLElement;
    //     element.classList.toggle('show');
    //   });
    // });

  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(e: KeyboardEvent) {
    const event = e;
    if (localStorage.getItem('searchFocused') !== '1' && (event.code === 'Space' || event.code === 'ArrowRight' || event.code === 'ArrowLeft' || event.code === 'Backspace')) {
      event.preventDefault();
      this.spotifyService.getCurrentPlayback().subscribe(result => {
        this.playback = result;
        if (event.code === 'Space') {
          if (this.playback.is_playing === true) {
            this.pausePlayback();
          } else {
            this.resumePlayback();
          }
        } else if (event.code === 'ArrowRight' && event.ctrlKey === true) {
          this.skipToNextTrack();
        } else if (event.code === 'ArrowLeft' && event.ctrlKey === true) {
          this.skipToPreviousTrack();
        } else if (event.code === 'Backspace' && event.shiftKey === true) {
          window.history.forward();
        } else if (event.code === 'Backspace') {
          window.history.back();
        }
      });
    }
  }

  searchSubmit(searchInput) {
    this.router.navigate(['/search/' + searchInput.value]);
  }

  setSearchFocused(state) {
    localStorage.setItem('searchFocused', state);
  }

  getUserSavedTracks(limit: number) {
    this.spotifyService.getUserSavedTracks(limit).subscribe(
      result => { this.globalService.favoriteTracks = JSON.stringify(result.items.map(a => a.track.id)); }
    );
  }

  getTracksFromContext() {
    if (this.playback && this.playback.context) {
      if (this.playback.context.type === 'playlist') {
        this.spotifyService.getPlaylist(this.playback.context.uri.split('playlist:', 2)[1]).subscribe(
          result => { this.tracksFromContext = result.tracks.items; }
        );
      } else if (this.playback.context.type === 'album') {
        this.spotifyService.getAlbumTracks(this.playback.context.uri.split('album:', 2)[1]).subscribe(
          result => { this.tracksFromContext = result.items; }
        );
      }
    }
    return this.tracksFromContext;
  }

  getCurrentPlayback() {
    this.spotifyService.getCurrentPlayback().subscribe(
      result => {
        console.log('getCurrentPlayback function is running in the header...');
        if (result && result.item) {
          this.backgroundColor = 'linear-gradient(to right, white ' +
            (result.progress_ms / result.item.duration_ms) * 100 + '%, #4C00D5 0%)';
          this.globalService.currentTrackId = result.item.id;
          this.playback = result;
        }
      }
    );
  }

  getDevices() {
    this.spotifyService.getDevices().subscribe(
      result => {
        if (result.devices.length > 0) {
          localStorage.setItem('hasDevices', '1');
          this.devices = result.devices;
          this.hasActiveDevice = false;
          this.devices.forEach(device => { if (device.is_active === true) { this.hasActiveDevice = true; } });
          if (this.hasActiveDevice === false) { this.playToDevice(this.devices[0].id, true); }
        } else {
          localStorage.setItem('hasDevices', '0');
        }
      }
    );
  }

  getUser() {
    this.spotifyService.getUser().subscribe(
      result => { this.user = result; }
    );
  }

  setRepeatMode(state: string) {
    this.spotifyService.setRepeatMode(state).subscribe();
  }

  toggleShuffle(state: boolean) {
    this.spotifyService.toggleShuffle(state).subscribe();
  }

  skipToPreviousTrack() {
    this.spotifyService.skipToPreviousTrack().subscribe();
  }

  resumePlayback() {
    this.spotifyService.resumePlayback().subscribe();
  }

  pausePlayback() {
    this.spotifyService.pausePlayback().subscribe();
  }

  skipToNextTrack() {
    this.spotifyService.skipToNextTrack().subscribe();
  }

  seek(event, duration) {
    this.spotifyService.seek((event.offsetX / event.target.offsetWidth) * duration).subscribe();
  }

  playToDevice(id: string, transferOnly?: boolean) {
    this.spotifyService.playToDevice(id, transferOnly).subscribe();
  }

  msToTime(timeInMS: number): string {
    const timeInS = Math.floor(timeInMS / 1000);
    const minutes = Math.floor(timeInS / 60);
    const seconds = timeInS - (minutes * 60);
    return minutes + ':' + (seconds < 10 ? '0' + seconds : seconds);
  }

  spotifyAuthorize() {
    this.spotifyService.spotifyAuthorize();
  }

  stopPropagation(event) {
    event.stopPropagation();
  }

  toggleIntegration() {
    this.integration = !this.integration;
  }

  toggleMenu() {
    document.body.classList.toggle('mobile-menu-active');
  }

}
