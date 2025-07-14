// src/app/store/id.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { setUserId } from './id.action';
import { IUser } from '../../models/iuser';

export const initialUserId: IUser = {} as IUser;

export const userIdReducer = createReducer(
  initialUserId,
  on(setUserId, (state, action) => action.userId)
);
