import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

export interface FreeProblem {
  id: number;
  ref_article: string;
  designation: string;
  numero_serie: string;
  code_depot: string;
  intitule: string;
  statut: string;
  code_abonnement: string;
  num_fixe: string;
  statut_radius: string;
  num_fixe_radius: string | null;
  mac: string | null;
}

export interface ExitedProblem extends FreeProblem {
  is_matched: boolean | null;
}

@Injectable({
  providedIn: 'root',
})
export class ProblemAxiaService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  exitedModems(
    page: number,
    limit: number,
    serialNumber: string,
    status: string,
    isMatch: string,
    intitule: string,
  ): Observable<ExitedProblem[]> {
    return this.http.get<ExitedProblem[]>(
      `${this.apiUrl}/problems/exited-modems?page=${page}&limit=${limit}&serialNumber=${serialNumber}&status=${status}&isMatch=${isMatch}&intitule=${intitule}`,
    );
  }

  reservedModems(
    page: number,
    limit: number,
    serialNumber: string,
    status: string,
    isMatch: string,
    intitule: string,
  ): Observable<ExitedProblem[]> {
    return this.http.get<ExitedProblem[]>(
      `${this.apiUrl}/problems/reserved-modems?page=${page}&limit=${limit}&serialNumber=${serialNumber}&status=${status}&isMatch=${isMatch}&intitule=${intitule}`,
    );
  }

  freeModems(
    page: number,
    limit: number,
    serialNumber: string,
    status: string,
    intitule: string,
  ): Observable<FreeProblem[]> {
    return this.http.get<FreeProblem[]>(
      `${this.apiUrl}/problems/free-modems-with-num-fixe?page=${page}&limit=${limit}&serialNumber=${serialNumber}&status=${status}&intitule=${intitule}`,
    );
  }
}
