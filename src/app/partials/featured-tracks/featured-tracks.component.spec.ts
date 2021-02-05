import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedTracksComponent } from './featured-tracks.component';

describe('FeaturedTracksComponent', () => {
  let component: FeaturedTracksComponent;
  let fixture: ComponentFixture<FeaturedTracksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeaturedTracksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturedTracksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
