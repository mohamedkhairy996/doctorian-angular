import { AbstractControl, ValidationErrors } from '@angular/forms';

export function dateNotBeforeToday(control: AbstractControl): ValidationErrors | null {
  const inputDate = new Date(control.value);
  const today = new Date();

  // Set time to 00:00:00 to compare only the date part
  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);

  return inputDate >= today ? null : { dateBeforeToday: true };
}
