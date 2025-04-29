import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideMonacoEditor } from 'ngx-monaco-editor-v2';

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));

  bootstrapApplication(AppComponent, {
    ...appConfig,
    providers: [
      ...(appConfig.providers ?? []),
      provideMonacoEditor({
        baseUrl: 'assets/monaco/vs',
        defaultOptions: {
          scrollBeyondLastLine: false,
          theme: 'vs-dark'
        },
        onMonacoLoad: () => {
          console.log('Monaco carregado!');
        }
      })
    ]
  });
