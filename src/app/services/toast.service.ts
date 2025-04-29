import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {

  constructor(private messageService: MessageService) { }

  showSuccess(detail: string) {
    console.log('cheguei aqui',detail )
    this.messageService.add({ severity: 'success', summary: 'Success', detail });
  }

  showError(detail: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail });
  }

  showInfo(detail: string) {
    this.messageService.add({ severity: 'info', summary: 'Info', detail });
  }

  showWarn(detail: string) {
    this.messageService.add({ severity: 'warn', summary: 'Warning', detail });
  }
}
