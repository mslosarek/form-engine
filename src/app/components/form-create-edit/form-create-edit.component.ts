import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { FormService, Form } from 'src/app/services/form.service';

@Component({
  selector: 'app-form-create-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-create-edit.component.html',
  styleUrl: './form-create-edit.component.scss'
})
export class FormCreateEditComponent implements OnInit {
  @Input() form: Form | null = null;
  @Output() formValid = new EventEmitter<boolean>();
  @Output() formValues = new EventEmitter<Form>();

  public formDefinition = new FormGroup({
    name: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
  });

  constructor(
    private formService: FormService,
  ) { }

  ngOnInit(): void {
    this.formDefinition.statusChanges.subscribe(() => {
      this.formValid.emit(this.formDefinition.valid);
    });
    this.formDefinition.valueChanges.subscribe((formValues) => {
      this.formValues.emit(formValues);
    });
    if (this.form) {
      this.formDefinition.setValue({
        name: this.form.name || '',
        title: this.form.title || '',
        description: this.form.description || '',
      });
    } else {
      this.formDefinition.patchValue({});
    }
  }

  isRequired(formControlName: string): boolean {
    const formControl = this.formDefinition.get(formControlName);
    if (!formControl) {
      return false;
    }
    return !!formControl.hasValidator(Validators.required);
  }

}
