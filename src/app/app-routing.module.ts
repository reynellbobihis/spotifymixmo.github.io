import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DiscoverComponent } from './pages/discover/discover.component';
import { SearchComponent } from './pages/search/search.component';
import { SongsComponent } from './pages/songs/songs.component';
import { ArtistsComponent } from './pages/artists/artists.component';
import { AlbumsComponent } from './pages/albums/albums.component';
import { SpotifyTokenRedirectComponent } from './pages/spotify-token-redirect/spotify-token-redirect.component';
import { PlaylistComponent } from './pages/playlist/playlist.component';
import { PlaylistsComponent } from './pages/playlists/playlists.component';
import { HistoryComponent } from './pages/history/history.component';
import { ArtistComponent } from './pages/artist/artist.component';
import { AlbumComponent } from './pages/album/album.component';

const routes: Routes = [
  { path: 'discover', component: DiscoverComponent },
  { path: 'search', component: SearchComponent },
  { path: 'search/:query', component: SearchComponent },
  { path: 'songs', component: SongsComponent },
  { path: 'albums', component: AlbumsComponent },
  { path: 'albums/:id', component: AlbumComponent },
  { path: 'artists', component: ArtistsComponent },
  { path: 'artists/:id', component: ArtistComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'playlist/:id', component: PlaylistComponent, pathMatch: 'full' },
  { path: 'playlists', component: PlaylistsComponent },
  { path: 'token', component: SpotifyTokenRedirectComponent },
  { path: '', component: SpotifyTokenRedirectComponent },
  { path: '**', redirectTo: 'discover' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
