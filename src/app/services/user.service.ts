import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformLocation } from '@angular/common';

import { Observable, of } from 'rxjs';
import { map, catchError, shareReplay, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import * as uuid from 'uuid';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentGetUserRequest: Observable<User | null> | null = null;

  constructor(
    private httpClient: HttpClient,
    private platformLocation: PlatformLocation,
  ) { }

  userChanged: EventEmitter<User | null> = new EventEmitter();

  getCurrentUser(): Observable<User | null> {
    if (!sessionStorage.getItem('AUTH_TOKEN')) {
      return of(null);
    }
    if (!this.currentGetUserRequest) {
      this.currentGetUserRequest = this.httpClient.get<User>('/api/v1/me')
      .pipe(
        shareReplay(undefined, 10 * 1000), // cache for 10 seconds
        tap((user) => {
          this.userChanged.emit(user);
          setTimeout(() => {
            this.currentGetUserRequest = null;
          }, 9 * 1000);
        }),
      );
    }
    return this.currentGetUserRequest;
  }

  isLoggedIn(): Observable<boolean> {
    return this.getCurrentUser()
    .pipe(
      map((user) => !!user),
      catchError(() => of(false)),
    );
  }

  logout(): void {
    console.log('logging out');
    // window.location.href = this.getLogoutLink();
    sessionStorage.removeItem('AUTH_TOKEN');
    this.userChanged.emit(null);
  }

  getLoginLink(): string {
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

  getLogoutLink(): string {
    const u = new URL(this.platformLocation.href);

    return `https://${environment.COGNITO_DOMAIN}/logout?client_id=${environment.COGNITO_CLIENT_ID}&redirect_uri=${u.origin}`;
  }
}
