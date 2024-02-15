import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Form } from 'src/app/services/form.service';

@Component({
  selector: 'app-form-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-table.component.html',
  styleUrl: './form-table.component.scss'
})
export class FormTableComponent {
  @Input() forms: Form[] = [];
  @Output() editForm = new EventEmitter<Form>();
  @Output() deleteForm = new EventEmitter<Form>();

  triggerEditForm(form: Form): void {
    this.editForm.emit(form);
  }

  triggerDeleteForm(form: Form): void {
    this.deleteForm.emit(form);
  }
}
