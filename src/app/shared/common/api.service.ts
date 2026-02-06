import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api`;

  constructor(private readonly http: HttpClient) {}

  getAll<T>(resource: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.apiUrl}/${resource}`);
  }

  getById<T>(resource: string, id: number): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${resource}/${id}`);
  }

  create<T>(resource: string, payload: unknown): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${resource}`, payload);
  }

  update(resource: string, id: number, payload: unknown): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${resource}/${id}`, payload);
  }

  delete(resource: string, id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${resource}/${id}`);
  }
}
