import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { userIdReducer } from './store/UserId/id.reducer';
import { provideNgxStripe } from 'ngx-stripe';
import { appointmentReducer } from './store/appointment/app.reducer';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(withFetch()), provideStore(
    {
      userId : userIdReducer,
      appointment : appointmentReducer
    }
  ),
provideNgxStripe("pk_test_51RhuyvHGAZFtsgHbNrYW9LtHgESzjVCOLMWJmAQdyh9bQi8tEwwoUCOc7xlFq7PHzTqieGHvvIXNcW2rUTvBbyoX00XezhhMeQ")]
};
