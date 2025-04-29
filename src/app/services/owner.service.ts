import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Artefact } from '../models/artefact.model';
import { Owner } from '../models/owner.model';
import { AuthService } from './auth.service';
import { UrlBuilder } from '../../utils/urlBuilder';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

   apiUrl = environment.baseUrl

   constructor(private http: HttpClient) { }

   headers = new HttpHeaders({'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}`});
  
    async getAll() {
      const url = UrlBuilder.from(this.apiUrl)
        .addRoute('Owner')
        .build();
      return await firstValueFrom(this.http.get<Owner[]>(url, {headers: this.headers}));
    }

    async findbyId(ownerId: string){
      const url = UrlBuilder.from(this.apiUrl)
      .addRoute('Owner')
      .addRoute('FindById')
      .addRoute(ownerId)
      .build();
    return await firstValueFrom(this.http.get<Owner>(url,{headers: this.headers}));
    }
  
    async create(owner: Owner) {
      const url = UrlBuilder.from(this.apiUrl)
      .addRoute('Owner')
      .build();
  
      return await firstValueFrom(this.http.post<Owner>(url, document, {headers: this.headers}));
    }
}
