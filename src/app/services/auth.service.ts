import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginRequestDTO, LoginResponseDto, RegisterDTO } from '../DTOs/auth.dto';
import { UrlBuilder } from '../../utils/urlBuilder';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
    apiUrl = environment.baseUrl
    private tokenKey = 'auth_token';

    constructor(private http: HttpClient, private router: Router) {}

    register(register: RegisterDTO){
      const url = UrlBuilder.from(this.apiUrl)
      .addRoute('Auth')
      .addRoute('register')
      .build();

      return this.http.post<string>(url, register)
    }

    login(login: LoginRequestDTO): Observable<any> {
      const url = UrlBuilder.from(this.apiUrl)
              .addRoute('Auth')
              .addRoute('login')
              .build();

      return this.http.post<LoginResponseDto>(url, login).pipe(
        tap(response => {
          sessionStorage.setItem(this.tokenKey, response.token);
        })
      );
      
    }
  
    logout() {
      sessionStorage.removeItem(this.tokenKey);
      this.router.navigate(['/login']);
    }
  
    getToken(): string | null {
      return sessionStorage.getItem(this.tokenKey);
    }
  
    isAuthenticated(): boolean {
      return !!this.getToken();
    }

    public tokenExpired(token: string) {
      const expirationDate = JSON.parse(atob(token.split('.')[1].replace(/-/g, "+").replace(/_/g, "/"))).exp;
      const now = Math.floor(new Date().getTime() / 1000);
      return expirationDate <= now;
    }

    getUserFromToken(token: string): any | null {
      try {
        const payloadBase64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const decodedPayload = JSON.parse(atob(payloadBase64));
        return {
          email: decodedPayload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
          id: decodedPayload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
          issuer: decodedPayload.iss,
          expires: decodedPayload.exp
        };
      } catch (e) {
        return null;
      }
    }
  
  }
