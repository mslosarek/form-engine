import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PlatformLocation } from '@angular/common';

import { environment } from 'src/environments/environment';

type JWTResponse = {
  access_token: string;
  id_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
};

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [],
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.scss'
})
export class AuthCallbackComponent implements OnInit{
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private platformLocation: PlatformLocation,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      const u = new URL(this.platformLocation.href);

      const body = new URLSearchParams();
      body.set('grant_type', 'authorization_code');
      body.set('code', params['code']);
      body.set('client_id', environment.COGNITO_CLIENT_ID);
      body.set('redirect_uri', `${u.origin}/auth/callback`);
      body.set('state', params['state']);

      this.httpClient.post<JWTResponse>(`https://${environment.COGNITO_DOMAIN}/oauth2/token`, body.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }).subscribe((response: JWTResponse) => {
        console.log(response);
        sessionStorage.setItem('AUTH_TOKEN', response['access_token']);
        this.router.navigate(['/']);
      });
    });
  }
}
