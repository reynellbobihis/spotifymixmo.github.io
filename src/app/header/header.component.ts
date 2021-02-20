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
  progressInterval: any;

  constructor(private spotifyService: SpotifyService, private globalService: GlobalService, private router: Router) { }

  ngOnInit() {
    localStorage.setItem('gettingthetoken', '0');
    this.getUser();
    this.getDevices();
    this.getCurrentPlayback();
    this.getUserSavedTracks(50);

    setInterval(() =>  {
      if (this.integration) {
        const isDevicesShown = document.getElementById('devicesDropdown').classList.contains('show');
        if (isDevicesShown) this.getDevices();
        setTimeout(() => this.getCurrentPlayback(), 330);
        setTimeout(() => this.getUserSavedTracks(50), 660);
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
    const { tagName } = document.activeElement;
    const inputs = ['input', 'select', 'button', 'textarea'];
    const isInputActive = inputs.indexOf(tagName.toLowerCase()) !== -1;

    if (!isInputActive) {
      const { code, ctrlKey, shiftKey, metaKey } = event;

      switch (code) {
        case 'Space':
          event.preventDefault();
          if (this.playback.is_playing) this.pausePlayback();
          else this.resumePlayback();
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (ctrlKey || metaKey) this.skipToNextTrack();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          if (ctrlKey || metaKey) this.skipToPreviousTrack();
          break;
        case 'Backspace':
          event.preventDefault();
          if (shiftKey) window.history.forward();
          else window.history.back();
          break;
        default:
          break;
      }
    }
  }

  searchSubmit(searchInput) {
    this.router.navigate(['/search/' + searchInput.value]);
  }

  getUserSavedTracks(limit: number) {
    this.spotifyService.getUserSavedTracks(limit).subscribe(
      result => this.globalService.favoriteTracks = result.items
    );
  }

  getTracksFromContext(playback: any) {
    if (playback && playback.context) {
      const { type, uri } = playback.context;

      switch (type) {
        case 'playlist':
          this.spotifyService.getPlaylist(uri.split('playlist:', 2)[1]).subscribe(
            result => this.tracksFromContext = result.tracks.items
          );
          break;
        case 'album':
          this.spotifyService.getAlbumTracks(uri.split('album:', 2)[1]).subscribe(
            result => this.tracksFromContext = result.items
          );
          break;
        default:
          break;
      }
    }
  }

  getCurrentPlayback() {
    clearInterval(this.progressInterval);
    this.spotifyService.getCurrentPlayback().subscribe(
      result => {
        console.log('getCurrentPlayback function is running in the header...');
        if (result && result.item) {
          let isUriChanged = true;
          if (this.playback) {
            const previousContext = this.playback.context ? this.playback.context.uri : this.playback.item.uri;
            const currentContext = result.context ? result.context.uri : result.item.uri;
            isUriChanged = previousContext !== currentContext;
          }
          if (!this.playback || isUriChanged) this.getTracksFromContext(result);

          this.playback = result;
          this.globalService.playback = result;

          this.setBgcolor();
          this.progressInterval = setInterval(() => {
            this.playback.progress_ms += 1000, 1000;
            this.setBgcolor();
          }, 1000);
        }
      }
    );
  }

  setBgcolor() {
    this.backgroundColor = 'linear-gradient(to right, white ' +
      (this.playback.progress_ms / this.playback.item.duration_ms) * 100 + '%, #4C00D5 0%)';
  }

  getDevices() {
    this.spotifyService.getDevices().subscribe(
      result => {
        const hasDevices = result.devices.length > 0;
        if (hasDevices) {
          this.devices = result.devices;
          this.hasActiveDevice = false;
          this.devices.forEach(device => {
            if (device.is_active) { this.hasActiveDevice = true; }
          });
          if (!this.hasActiveDevice) { this.playToDevice(this.devices[0].id, true); }
        }
        this.globalService.hasDevices = hasDevices;
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
