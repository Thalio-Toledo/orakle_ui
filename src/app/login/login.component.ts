import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { LoginRequestDTO, RegisterDTO } from '../DTOs/auth.dto';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { Owner } from '../models/owner.model';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule, ButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.less'
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  registerForm: FormGroup;
  error: string | null = null;

  loginMode = true

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private toastService: ToastService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    let token = sessionStorage.getItem('auth_token')
    if(token){
      let tokenExpired = this.authService.tokenExpired(token)

      if(!tokenExpired)
        this.router.navigate([`/owner`]);
    }
  }

  setRegisterMode(){
    this.loginMode = !this.loginMode
  }



  login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      let login = new LoginRequestDTO()
      login.email = email
      login.password = password

      this.loginForm.get('password')?.reset(); 

      this.authService.login(login).pipe(
        tap(resp => this.router.navigate([`/owner`]))
      ).subscribe()
    }
  }

  register(){
    if (this.registerForm.valid) {
      const {name, email, password } = this.registerForm.value;
      let register = new RegisterDTO()
      register.name = name
      register.email = email
      register.password = password

      this.loginForm.get('password')?.reset(); 

      this.authService.register(register).pipe(
        tap(resp => this.toastService.showSuccess(resp))
      ).subscribe()
    }
  }

}
