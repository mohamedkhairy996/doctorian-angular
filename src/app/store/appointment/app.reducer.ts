
import { createReducer, on } from '@ngrx/store';
import { setAppointment } from './app.action';
import { Appointment } from '../../models/Iappointment';

export const initialAppointment: Appointment = {} as Appointment;

export const appointmentReducer = createReducer(
  initialAppointment,
  on(setAppointment, (state, action) => action.appointment)
);
