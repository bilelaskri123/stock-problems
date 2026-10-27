import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface DesignationCount {
  total: number;
  designation: string;
}

@Injectable({
  providedIn: 'root',
})
export class DesignationService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  freeDesignation(intitule: string): Observable<DesignationCount[]> {
    return this.http.get<DesignationCount[]>(
      `${this.apiUrl}/designation/free?intitule=${intitule}`,
    );
  }

  reservedDesignation(intitule: string): Observable<DesignationCount[]> {
    return this.http.get<DesignationCount[]>(
      `${this.apiUrl}/designation/reserved?intitule=${intitule}`,
    );
  }
}
