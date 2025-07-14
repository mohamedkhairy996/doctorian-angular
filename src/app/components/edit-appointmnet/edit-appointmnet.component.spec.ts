import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAppointmnetComponent } from './edit-appointmnet.component';

describe('EditAppointmnetComponent', () => {
  let component: EditAppointmnetComponent;
  let fixture: ComponentFixture<EditAppointmnetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAppointmnetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAppointmnetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
