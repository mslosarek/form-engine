import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCreateEditComponent } from './form-create-edit.component';

describe('FormCreateEditComponent', () => {
  let component: FormCreateEditComponent;
  let fixture: ComponentFixture<FormCreateEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCreateEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormCreateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
