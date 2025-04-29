import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Artefact } from '../models/artefact.model';
import { ArtefactFilter } from '../filters/artefact.filter';
import { environment } from '../environments/environment';
import { UrlBuilder } from '../../utils/urlBuilder';

@Injectable({
  providedIn: 'root'
})
export class ArtefactService {

  apiUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

  headers = new HttpHeaders({'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}`});

  async getAll() {
    const url = UrlBuilder.from(this.apiUrl)
      .addRoute('Artefact')
      .build();
    return await firstValueFrom(this.http.get<Artefact[]>(url,{headers: this.headers}));
  }

  async getByTitle(title: string) {
    const url = UrlBuilder.from(this.apiUrl)
      .addRoute('Artefact')
      .addRoute('GetByTitle')
      .addRoute(title)
      .build();
    return await firstValueFrom(this.http.get<Artefact[]>(url,{headers: this.headers}));
  }

  async getByOwnerId(OwnerId: string) {
    const url = UrlBuilder.from(this.apiUrl)
      .addRoute('Artefact')
      .addRoute('GetByOwnerId')
      .addRoute(OwnerId)
      .build();
    return await firstValueFrom(this.http.get<Artefact[]>(url,{headers: this.headers}));
  }

  async getByFilter(artefactFilter: ArtefactFilter) {
    const url = UrlBuilder.from(this.apiUrl)
      .addRoute('Artefact')
      .addRoute('GetByFilter')
      .populateParams(artefactFilter)
      .build();
    return await firstValueFrom(this.http.get<Artefact[]>(url,{headers: this.headers}));
  }

  async externalGetByFilter(artefactFilter: ArtefactFilter) {
    const url = UrlBuilder.from(this.apiUrl)
      .addRoute('Artefact')
      .addRoute('External')
      .addRoute('GetByFilter')
      .populateParams(artefactFilter)
      .build();
    return await firstValueFrom(this.http.get<Artefact[]>(url,{headers: this.headers}));
  }

  async findById(artefactId: string) {
    const url = UrlBuilder.from(this.apiUrl)
      .addRoute('Artefact')
      .addRoute('FindById')
      .addRoute(artefactId)
      .build();
    return await firstValueFrom(this.http.get<Artefact>(url,{headers: this.headers}));
  }

  async create(artefact: Artefact) {
    const url = UrlBuilder.from(this.apiUrl)
    .addRoute('Artefact')
    .build();

    return await firstValueFrom(this.http.post<Artefact>(url, artefact,{headers: this.headers}));
  }

  async update(artefact: Artefact) {
    const url = UrlBuilder.from(this.apiUrl)
    .addRoute('Artefact')
    .build();

    return await firstValueFrom(this.http.put<Artefact>(url, artefact,{headers: this.headers}));
  }
  async delete(artefactId: string) {
    const url = UrlBuilder.from(this.apiUrl)
    .addRoute('Artefact')
    .addRoute(artefactId)
    .build();

    return await firstValueFrom(this.http.delete<Artefact>(url,{headers: this.headers}));
  }

}
