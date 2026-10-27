import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { DetailsService, ModemCount } from 'src/app/services/details.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  imports: [
    MatCardModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatTableModule,
    MaterialModule,
    MatPaginatorModule,
    MatSnackBarModule,
  ],
})
export class AppDetailsComponent implements OnInit {
  private detailsService = inject(DetailsService);
  private router = inject(Router);
  snackBar: MatSnackBar = inject(MatSnackBar);
  isLoading: WritableSignal<boolean> = signal(false);
  pageIndex: WritableSignal<number> = signal(1);
  pageSize: WritableSignal<number> = signal(10);
  dataLength: WritableSignal<number> = signal(1);
  modemDetails: WritableSignal<ModemCount[]> = signal([]);
  modemDetailsCopy: WritableSignal<ModemCount[]> = signal([]);

  filterForm = new FormGroup({
    intitule: new FormControl<string>('', []),
  });

  constructor() {}

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
    this.detailsService.modemDetails().subscribe({
      next: (response: ModemCount[]) => {
        this.modemDetails.set(response);
        this.modemDetailsCopy.set(response.slice(0, 10));
        this.dataLength.set(this.modemDetails().length);
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
    if (this.pageSize() !== event.pageSize) {
      this.pageIndex.set(0);
    } else {
      this.pageIndex.set(event.pageIndex);
    }
    this.pageSize.set(event.pageSize);
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();
    const filterCriteria = this.filterForm.value.intitule!;
    const filteredModems = this.modemDetails().filter((modem) =>
      modem.Intitule.toLowerCase().includes(filterCriteria?.toLowerCase()),
    );
    this.dataLength.set(filteredModems.length);
    this.modemDetailsCopy.set(filteredModems.slice(start, end));
  }

  onFilter() {
    const filterCriteria = this.filterForm.value.intitule!;
    const filteredModems = this.modemDetails().filter((modem) =>
      modem.Intitule.toLowerCase().includes(filterCriteria?.toLowerCase()),
    );
    this.pageIndex.set(1);
    this.pageSize.set(10);
    this.dataLength.set(filteredModems.length);
    this.modemDetailsCopy.set(filteredModems.slice(0, 10));
  }

  viewDetails(modem: ModemCount, type: string) {
    if (type == 'free') {
      if (!modem.free) {
        return;
      }
      this.router.navigate(['/ui-components/free-designation'], {
        queryParams: { intitule: modem.Intitule },
      });
    } else {
      if (!modem.reserved) return;
      this.router.navigate(['/ui-components/reserved-designation'], {
        queryParams: { intitule: modem.Intitule },
      });
    }
  }
}
