import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotifyTokenRedirectComponent } from './spotify-token-redirect.component';

describe('SpotifyTokenRedirectComponent', () => {
  let component: SpotifyTokenRedirectComponent;
  let fixture: ComponentFixture<SpotifyTokenRedirectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpotifyTokenRedirectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotifyTokenRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
