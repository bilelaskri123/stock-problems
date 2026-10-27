import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UploadRadiusModemService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  uploadModems(form: FormData) {
    return this.http.post(`${this.apiUrl}/upload-modems`, form);
  }
}
