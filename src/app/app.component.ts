import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
   
  }
  title = 'orakle_ui';
}
