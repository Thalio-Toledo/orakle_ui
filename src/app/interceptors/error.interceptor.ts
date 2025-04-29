import { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { timeout, catchError, TimeoutError } from "rxjs";
import { ToastService } from "../services/toast.service";

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const _snackbarService = inject(ToastService);
  
    return next(req).pipe(
      timeout(5000),
      catchError((error) => {
  
        if (error instanceof TimeoutError) {
          console.warn('Timeout detectado no interceptor');
  
          _snackbarService.showError('Tempo limite da requisição excedido.');
  
          const timeoutErrorResponse = {
            status: 408,
            message: 'Timeout',
            error: { message: 'A requisição expirou.' }
          };
  
          throw timeoutErrorResponse;
        }
  
        if (error instanceof HttpErrorResponse) {
          let navigationExtras;
  
          switch (error.status) {
            case 400:
              if (error.error.errors) {
                const modelStateErrors = [];
                for (const key in error.error.errors) {
                  if (error.error.errors[key]) {
                    modelStateErrors.push(error.error.errors[key]);
                    _snackbarService.showError("Os dados enviados não estão no formato esperado.");
                  }
                }
                throw modelStateErrors;
              } else {
                _snackbarService.showError(error.error);
              }
              break;
  
            case 401:
              _snackbarService.showError('Não autorizado');
              break;
  
            case 404:
              _snackbarService.showError('Recurso não encontrado');
              break;
  
            case 405:
              _snackbarService.showError('Método não permitido');
              break;
  
            case 500:
              navigationExtras = { state: { error: error.error } };
              _snackbarService.showError(error.error.error?.message ?? 'Erro interno do servidor');
              break;
  
            case 307:
              console.log('Redirect(307)..');
              break;
  
            default:
              _snackbarService.showError('Algo deu errado...');
              break;
          }
        }
  
        throw error;
      })
    );
  };
  