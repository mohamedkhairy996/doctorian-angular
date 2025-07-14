
import { createAction, props } from '@ngrx/store';
import { Appointment } from '../../models/Iappointment';

export const setAppointment = createAction(
  'Set appointment',
  props<{ appointment: Appointment }>()
);
