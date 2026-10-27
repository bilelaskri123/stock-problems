import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import {
  ExitedProblem,
  ProblemAxiaService,
} from 'src/app/services/problem-axia.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-exited-modems',
  templateUrl: './exited-modems.component.html',
  styleUrls: ['./exited-modems.component.scss'],
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatOption,
    MatTableModule,
    MaterialModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppExitedModemsComponent implements OnInit {
  exitedProblems: WritableSignal<ExitedProblem[]> = signal([]);
  statuses: string[] = ['None', 'Found', 'Not Found', 'Fixe Axia Not Found'];
  isLoading: WritableSignal<boolean> = signal(false);
  pageIndex: WritableSignal<number> = signal(1);
  pageSize: WritableSignal<number> = signal(10);

  filterForm = new FormGroup({
    serialNumber: new FormControl<string>('', []),
    intitule: new FormControl<string>('', []),
    statutRadius: new FormControl('', []),
    isMatch: new FormControl('', []),
  });

  private problemAxiaService = inject(ProblemAxiaService);
  snackBar: MatSnackBar = inject(MatSnackBar);

  ngOnInit() {
    this.getData();
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

  private getData() {
    this.isLoading.set(true);
    if (this.filterForm.value.statutRadius == 'None') {
      this.filterForm.patchValue({ statutRadius: '' });
    }
    this.problemAxiaService
      .exitedModems(
        this.pageIndex(),
        this.pageSize(),
        this.filterForm.value.serialNumber || '',
        this.filterForm.value.statutRadius || '',
        this.filterForm.value.isMatch || '',
        this.filterForm.value.intitule || '',
      )
      .subscribe({
        next: (response: ExitedProblem[]) => {
          this.exitedProblems.set(response);
          this.showSnackBar('Successfully Fetching Data', 'success');
        },
        error: (error: any) => {
          this.showSnackBar('Error fetching free modems', 'error');
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });
  }

  changePage(event: PageEvent) {
    console.log('Page changed:', event.pageIndex, event.pageSize);
    this.pageIndex.set(event.pageIndex + 1); // Increment pageIndex by 1 to match the API's 1-based indexing
    this.pageSize.set(event.pageSize);
    this.getData();
  }

  onFilter() {
    this.getData();
  }
}
