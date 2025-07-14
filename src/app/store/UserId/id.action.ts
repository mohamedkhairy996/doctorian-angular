
import { createAction, props } from '@ngrx/store';
import { IUser } from '../../models/iuser';

export const setUserId = createAction(
  'Set User ID',
  props<{ userId: IUser }>()
);
