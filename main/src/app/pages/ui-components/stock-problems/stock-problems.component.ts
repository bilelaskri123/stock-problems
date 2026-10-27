import { MatOption } from '@angular/material/core';
import {
  ChangeDetectionStrategy,
  Component,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppExitedModemsComponent } from '../exited-modems/exited-modems.component';
import { AppFreeModemsComponent } from '../free-modems/free-modems.component';
import { AppReservedModemsComponent } from '../reserved-modems/reserved-modems.component';

@Component({
  selector: 'app-chips',
  templateUrl: './stock-problems.component.html',
  styleUrls: ['./stock-problems.component.scss'],
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    FormsModule,
    MatButtonModule,
    MatOption,
    MatTableModule,
    MaterialModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    AppExitedModemsComponent,
    AppFreeModemsComponent,
    AppReservedModemsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppStockProblemsComponent {
  subjects: string[] = [
    'Free Modem With Num Fixe',
    'Exited Modem',
    'Reserved Modem',
  ];
  subject: WritableSignal<string> = signal('');
  selectedSubject: WritableSignal<string> = signal('');

  onClickCheckProblems() {
    this.selectedSubject.set(this.subject());
  }
}
