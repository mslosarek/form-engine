import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserService, User } from 'src/app/services/user.service';

import { of } from 'rxjs';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  public title = 'Home';

  public loginLink: string | null = null;
  public authToken: string | null = null;

  public user: User | null = null;

  constructor(
    private userService: UserService,
  ) {
    this.authToken = sessionStorage.getItem('AUTH_TOKEN');
    this.loginLink = this.generateLoginLink();
  }

  ngOnInit(): void {
    this.userService.isLoggedIn()
    .pipe(
      switchMap((isLoggedIn) => {
        if (isLoggedIn) {
          return this.userService.getCurrentUser();
        }
        return of(null);
      })
    )
    .subscribe((currentUser: User | null) => {
      this.user = currentUser;
    })
   }

  generateLoginLink(): string {
    return this.userService.getLoginLink();
  }
}
