import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HistoryComponent } from './pages/history/history.component';
import { ArtistComponent } from './pages/artist/artist.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SpotifyService } from './spotify.service';
import { GlobalService } from './global.service';
import { TracksListComponent } from './partials/tracks-list/tracks-list.component';
import { SpotifyTokenRedirectComponent } from './pages/spotify-token-redirect/spotify-token-redirect.component';
import { AlbumComponent } from './pages/album/album.component';
import { AlbumsComponent } from './pages/albums/albums.component';
import { ArtistsComponent } from './pages/artists/artists.component';
import { DiscoverComponent } from './pages/discover/discover.component';
import { PlaylistComponent } from './pages/playlist/playlist.component';
import { SongsComponent } from './pages/songs/songs.component';
import { ArtistAlbumsComponent } from './partials/artist-albums/artist-albums.component';
import { ArtistDetailsComponent } from './partials/artist-details/artist-details.component';
import { FeaturedArtistsComponent } from './partials/featured-artists/featured-artists.component';
import { FeaturedTracksComponent } from './partials/featured-tracks/featured-tracks.component';
import { NewReleasesComponent } from './partials/new-releases/new-releases.component';
import { TopTracksComponent } from './partials/top-tracks/top-tracks.component';
import { SearchComponent } from './pages/search/search.component';
import { AlbumsListComponent } from './partials/albums-list/albums-list.component';
import { PlaylistsListComponent } from './partials/playlists-list/playlists-list.component';
import { ArtistsListComponent } from './partials/artists-list/artists-list.component';

@NgModule({
  imports:      [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule
  ],
  declarations: [
    AppComponent,
    HistoryComponent,
    ArtistComponent,
    HeaderComponent,
    SidebarComponent,
    TracksListComponent,
    SpotifyTokenRedirectComponent,
    AlbumComponent,
    AlbumsComponent,
    ArtistsComponent,
    DiscoverComponent,
    PlaylistComponent,
    SongsComponent,
    ArtistAlbumsComponent,
    ArtistDetailsComponent,
    FeaturedArtistsComponent,
    FeaturedTracksComponent,
    NewReleasesComponent,
    TopTracksComponent,
    SearchComponent,
    AlbumsListComponent,
    PlaylistsListComponent,
    ArtistsListComponent
  ],
  bootstrap:    [ AppComponent ],
  providers: [
    SpotifyService,
    GlobalService
  ]
})
export class AppModule { }
