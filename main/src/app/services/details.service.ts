import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

export interface ModemCount {
  Intitule: string;
  Adresse: string;
  Ville: string;
  CodePostal: string;
  Contact: string;
  Mail: string;
  Telephone: string;
  CodeRegion: string;
  free: number;
  reserved: number;
  exited: number;
}

@Injectable({
  providedIn: 'root',
})
export class DetailsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  modemDetails(): Observable<ModemCount[]> {
    return this.http.get<ModemCount[]>(`${this.apiUrl}/details`);
  }
}
