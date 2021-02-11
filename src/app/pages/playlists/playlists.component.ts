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

  constructor(private dialog: MatDialog, private spotifyService: SpotifyService, private router: Router) {
    this.uploadForm = {};
    this.progress = {};
  }

  ngOnInit() {
    // this.getUserPlaylists(0);
  }

  newPlaylist(_fileIndex: number) {
    const fileIndex = _fileIndex || 0;
    const { file, name } = this.uploadForm;

    if (file) {
      const _file:File = file.files[fileIndex];
      const myReader:FileReader = new FileReader();
      const trimFileExt = fileName => fileName.split('.').slice(0, -1).join('.');

      if (this.uploadForm.file.files.length > 1 || !name) this.uploadForm.name = trimFileExt(_file.name);
      this.progress.file = 0;
      this.progress.fileName = this.uploadForm.name;

      myReader.onloadend = () => {
        const lines = myReader.result.toString().split('\n');
        const size = lines.length;
        const queries = [];
        lines.forEach((line, index) => {
          const arr = trimFileExt(line).split('/');
          const query = arr[arr.length - 1];
  
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
        const { file } = this.uploadForm;

        if (file) {
          const { length } = file.files;

          this.progress.total = Math.floor((fileIndex + 1 / length) * 100);
          console.log('fileIndex:', fileIndex, 'length:', length, 'total:' + (fileIndex + 1 / length) * 100);
          console.log('Done!');

          if (length > ++fileIndex) {
            setTimeout(() => this.newPlaylist(fileIndex), 1000);
          } else {
            console.log('Done All!');
            setTimeout(() => {
              this.uploadForm = {};
              this.progress = {};
            }, 1000);
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
        this.progress.file = Math.floor((index / length) * 100);
        if (queries[index] && result.tracks.items[0]) uris.push(result.tracks.items[0].uri);
        if (size == ++index) this.createPlaylist(uris, fileIndex);
        else setTimeout(() => this.search(queries, size, index, uris, fileIndex), 0);
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
    this.dialog.open(dialog);
  }

}
