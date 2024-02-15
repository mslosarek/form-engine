import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';

import { UserService, User } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ CommonModule, RouterLink, NgbDropdownModule ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  public currentUser: User | null = null;
  public collapsed = false;

  constructor(public userService: UserService) { }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
    });
    this.userService.userChanged.subscribe((user) => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.userService.logout();
  }
}
