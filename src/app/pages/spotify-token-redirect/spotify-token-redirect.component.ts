import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-spotify-token-redirect',
  templateUrl: './spotify-token-redirect.component.html',
  styleUrls: ['./spotify-token-redirect.component.scss']
})
export class SpotifyTokenRedirectComponent implements OnInit {
  fragment = null;
  token = null;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.fragment.subscribe(hashFragment => {
      this.fragment = hashFragment;
      if (this.fragment) {
        this.token = this.fragment.replace('access_token=', '').split('&token_type')[0];
        localStorage.setItem('token', this.token);
        localStorage.setItem('gettingthetoken', '0');
        window.close();
      } else {
        this.router.navigate(['/discover']);
      }
    });
  }

}
