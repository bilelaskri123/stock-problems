import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { catchError, of, Subscription, tap } from 'rxjs';
import {
  DesignationCount,
  DesignationService,
} from 'src/app/services/designation.service';

@Component({
  selector: 'app-free-designation',
  imports: [MatSnackBarModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './free-designation.html',
  styleUrl: './free-designation.scss',
})
export class AppFreeDesignation implements OnInit, OnDestroy {
  private designationService = inject(DesignationService);
  private route = inject(ActivatedRoute);
  snackBar: MatSnackBar = inject(MatSnackBar);
  private queryParamSub: Subscription;
  intitule: WritableSignal<string | null> = signal(null);
  designationCount: WritableSignal<DesignationCount[]> = signal([]);
  isLoading: WritableSignal<boolean> = signal(false);

  ngOnInit(): void {
    this.getFreeDesignation();
  }

  getFreeDesignation() {
    this.isLoading.set(true);
    this.queryParamSub = this.route.queryParamMap.subscribe((params) => {
      const intitule = params.get('intitule');
      this.intitule.set(intitule);
      if (!this.intitule()) {
        return;
      }
      this.designationService
        .freeDesignation(this.intitule()!)
        .pipe(
          catchError((error) => {
            this.showSnackBar('Error Fetching Data', 'error');
            this.isLoading.set(false);
            return of([]);
          }),
          tap((result) => {
            this.designationCount.set(result);
            this.isLoading.set(false);
            this.showSnackBar('Fetching Data Successfully', 'success');
          }),
        )
        .subscribe();
    });
  }

  private showSnackBar(message: string, status: 'error' | 'success') {
    if (status === 'success') {
      this.snackBar.open(message, 'close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['success-snackbar'],
      });
    } else {
      this.snackBar.open(message, 'close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      });
    }
  }

  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    this.queryParamSub.unsubscribe();
  }
}
