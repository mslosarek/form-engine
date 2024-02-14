import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformLocation } from '@angular/common';

import { Observable, of } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import * as uuid from 'uuid';

export interface User {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private httpClient: HttpClient,
    private platformLocation: PlatformLocation,
  ) { }

  getCurrentUser(): Observable<User> {
    return this.httpClient.get<User>('/api/v1/me')
    .pipe(
      shareReplay(undefined, 10 * 1000) // cache for 10 seconds
    );
  }

  isLoggedIn(): Observable<boolean> {
    return this.getCurrentUser()
    .pipe(
      map((user) => !!user),
      catchError(() => of(false)),
    );
  }

  getLoginLink(): string {
    // return '/api/v1/login';
    let authState = sessionStorage.getItem('AUTH_STATE');
    if (!authState) {
      sessionStorage.setItem('AUTH_STATE', uuid.v4());
      authState = sessionStorage.getItem('AUTH_STATE');
    }
    const u = new URL(this.platformLocation.href);

    return [
      `https://${environment.COGNITO_DOMAIN}/login?`,
      `response_type=code&`,
      `client_id=${environment.COGNITO_CLIENT_ID}&`,
      `redirect_uri=${u.origin}/auth/callback&`,
      `state=${authState}&`,
      `scope=openid+profile+aws.cognito.signin.user.admin&`,
    ].join('');
  }
}
