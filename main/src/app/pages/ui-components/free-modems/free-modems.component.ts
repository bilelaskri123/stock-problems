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
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import {
  FreeProblem,
  ProblemAxiaService,
} from 'src/app/services/problem-axia.service';

@Component({
  selector: 'app-free-modems',
  templateUrl: './free-modems.component.html',
  styleUrls: ['./free-modems.component.scss'],
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
export class AppFreeModemsComponent implements OnInit {
  subjects: string[] = ['Free Modem With Num Fixe', 'Exited Modem Check'];
  statuses: string[] = ['None', 'Found', 'Not Found', 'Fixe Axia Not Found'];
  subject: string = '';
  isLoading: WritableSignal<boolean> = signal(false);
  freeProblems: WritableSignal<FreeProblem[]> = signal([]);
  type: WritableSignal<string> = signal('');
  pageIndex: WritableSignal<number> = signal(1);
  pageSize: WritableSignal<number> = signal(10);
  snackBar: MatSnackBar = inject(MatSnackBar);

  filterForm = new FormGroup({
    serialNumber: new FormControl<string>('', []),
    intitule: new FormControl<string>('', []),
    statutRadius: new FormControl('', []),
  });

  private problemAxiaService = inject(ProblemAxiaService);

  ngOnInit(): void {
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
      .freeModems(
        this.pageIndex(),
        this.pageSize(),
        this.filterForm.value.serialNumber || '',
        this.filterForm.value.statutRadius || '',
        this.filterForm.value.intitule || '',
      )
      .subscribe({
        next: (response: FreeProblem[]) => {
          this.freeProblems.set(response);
          this.type.set('free_modems');
          this.showSnackBar('Successfully Fetching Data', 'success');
        },
        error: (error) => {
          this.showSnackBar('Error fetching free modems', 'error');
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });
  }

  changePage(event: PageEvent) {
    this.pageIndex.set(event.pageIndex + 1); // Increment pageIndex by 1 to match the API's 1-based indexing
    this.pageSize.set(event.pageSize);
    this.getData();
  }

  onFilter() {
    this.getData();
  }
}
