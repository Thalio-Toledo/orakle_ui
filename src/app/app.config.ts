import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import Aura from '@primeng/themes/aura';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { MessageService } from 'primeng/api';

// export const appConfig: ApplicationConfig = {
//   providers: []
// };

export const appConfig: ApplicationConfig = {
  providers: [
      MessageService,
      provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes),
      provideHttpClient(withInterceptors([ErrorInterceptor])),
      provideAnimationsAsync(),
      providePrimeNG({
          theme: {
              preset: Aura
          }
      })
  ]
};
