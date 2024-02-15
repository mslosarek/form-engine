import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModalModule, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { UserService, User } from 'src/app/services/user.service';
import { FormService, Form } from 'src/app/services/form.service';

import { FormTableComponent } from 'src/app/components/form-table/form-table.component';
import { FormCreateEditComponent } from 'src/app/components/form-create-edit/form-create-edit.component';

import { of } from 'rxjs';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgbModalModule, FormCreateEditComponent, FormTableComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
	private modalService = inject(NgbModal);

  public closeResult = '';
  public title = 'Home';

  public loginLink: string | null = null;
  public authToken: string | null = null;

  public user: User | null = null;
  public checked = false;

  public forms: Form[] = [];
  public editingForm: Form | null = null;
  public formValues: Form | null = null;
  public formValid = false;

  constructor(
    private userService: UserService,
    private formService: FormService,
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
        this.checked = true;
        return of(null);
      })
    )
    .subscribe((currentUser: User | null) => {
      this.user = currentUser;
      this.checked = true;
    });

    this.userService.userChanged.subscribe((user) => {
      this.user = user;
      this.checked = true;
    });

    this.userService.userChanged
    .pipe(
      switchMap((user) => {
        if (user) {
          return this.formService.getForms();
        }
        return of([]);
      })
    )
    .subscribe((forms: Form[]) => {
      this.forms = forms;
    });
   }

  generateLoginLink(): string {
    return this.userService.getLoginLink();
  }

  test(): void {
    console.log('test');
  }

  open(content: TemplateRef<any>, existingForm?: Form): void {
    if (existingForm) {
      this.editingForm = existingForm;
    } else {
      this.editingForm = null;
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl'})
    .result.then(
			() => {
        console.log(this.formValues);
        const {
          name,
          title,
          description,
        } = this.formValues || {};
        if (!this.editingForm) {
          this.formService.createForm({
            name,
            title,
            description,
          })
          .pipe(
            switchMap(() => this.formService.getForms(true))
          )
          .subscribe((forms: Form[]) => {
            this.forms = forms;
            this.formValues = null;
            this.editingForm = null;
          });
        } else if (this.editingForm.id) {
          this.formService.updateForm(this.editingForm.id, {
            name,
            title,
            description,
          })
          .pipe(
            switchMap(() => this.formService.getForms(true))
          )
          .subscribe((forms: Form[]) => {
            this.forms = forms;
            this.formValues = null;
            this.editingForm = null;
          });
        }
			},
			() => {
        this.formValues = null;
        this.editingForm = null;
			},
		);
	}

  setFormValid(valid: boolean): void {
    this.formValid = valid;
  }

  setFormValues(form: Form): void {
    this.formValues = form;
  }
}
