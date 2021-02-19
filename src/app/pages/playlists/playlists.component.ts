import { Component, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SpotifyService } from 'src/app/spotify.service';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss']
})
export class PlaylistsComponent implements OnInit {
  playlists: any;
  uploadForm: any;
  progress: any;
  files = [];
  dialogRef: any;

  constructor(private dialog: MatDialog, private spotifyService: SpotifyService, private router: Router) {
    this.uploadForm = {};
    this.progress = {};
    this.progress.total = 0;
  }

  ngOnInit() {
    // this.getUserPlaylists(0);
  }

  fileInputChanged(e) {
    this.files = e.target.files;
    e.target.style.position = this.files.length ? 'absolute' : 'static';
  }

  newPlaylist(_fileIndex: number) {
    const fileIndex = _fileIndex || 0;
    const { name } = this.uploadForm;

    if (this.files) {
      const _file:File = this.files[fileIndex];
      const myReader:FileReader = new FileReader();
      const trimFileExt = fileName => fileName.split('.').slice(0, -1).join('.');

      if (this.files.length > 1 || !name) this.uploadForm.name = trimFileExt(_file.name);
      this.progress.file = 0;
      this.progress.total = 0;
      this.progress.fileName = this.uploadForm.name;

      myReader.onloadend = () => {
        const lines = myReader.result.toString().split('\n');
        const size = lines.length;
        const queries = [];
        lines.forEach((line, index) => {
          const arr = trimFileExt(line).split('/');
          let query = arr[arr.length - 1]
            .replace('’', '\'')
            .replace('feat. ', ' ')
            .replace('(', ' ')
            .replace(')', ' ');
          // For tracks inside album folders
          if (/[0-9]{2} - /g.test(query)) {
            const folder = arr[arr.length - 2]
              .replace(/[0-9]{4} /g, '')
              .split(' - ')[0];
            const title = query.replace(/[0-9]{2} - /g, '');
            query = folder + ' ' + title;
          }
  
          if (query) queries.push(query);
          if (size == index + 1) {
            this.search(queries, size, 0, [], fileIndex);
          }
        });
      };

      myReader.readAsText(_file);
    } else {
      this.createPlaylist();
    }
  }

  createPlaylist(uris?: string[], fileIndex?: number) {
    const { name, description } = this.uploadForm
    this.spotifyService.createPlaylist(name, false, description).subscribe(
      result => {
        const { id } = result;
        if (uris) {
          this.addTracksToPlaylist(id, uris, fileIndex);
        } else {
          this.router.navigate([ '/playlist/' + id ]);
        }
      }
    );
  }

  addTracksToPlaylist(id: string, uris: string[], fileIndex: number) {
    this.spotifyService.addTracksToPlaylist(id, uris).subscribe(
      () => {
        if (this.files) {
          const { length } = this.files;

          // this.progress.total = Math.floor(((fileIndex + 1) / length) * 100);
          console.log('Done!');

          if (length > ++fileIndex) {
            setTimeout(() => this.newPlaylist(fileIndex), 1000);
          } else {
            console.log('All done!');
            this.dialogRef.close();
          }
        }
      }
    );
  }

  search(queries: any, size: number, index: number, tracks: string[], fileIndex: number) {
    this.spotifyService.search(queries[index], null, 1, 'track').subscribe(
      result => {
        const uris = tracks;
        const { length } = queries;
        const fileProgress = ((fileIndex + 1) / this.files.length) * 100;

        this.progress.file = Math.floor((index / length) * 100);
        this.progress.total = Math.floor(fileProgress + (index / (length * this.files.length)));

        if (queries[index] && result.tracks.items[0]) uris.push(result.tracks.items[0].uri);
        if (size == ++index) this.createPlaylist(uris, fileIndex);
        else this.search(queries, size, index, uris, fileIndex);
      }
    );
  }

  getUserPlaylists(offset) {
    this.spotifyService.getUserPlaylists(null, offset, 50).subscribe(result => {
      this.playlists = this.playlists ? this.playlists.concat(result.items) : result.items;
      if (result.items.length % 50 == 0) {
        setTimeout(() => this.getUserPlaylists(offset + 50), 2000);
      }
    });
  }

  openAddPlaylistDialog(dialog: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(dialog);
    this.dialogRef.afterClosed().subscribe(() => {
      this.uploadForm = {};
      this.files = [];
      this.progress.total = 0;
    });
  }
}
