import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, NgForm } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { UploadRadiusModemService } from 'src/app/services/upload-radius-modem.service';

@Component({
  selector: 'app-badge',
  templateUrl: './upload-modem.component.html',
  imports: [
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatSnackBarModule,
  ],
})
export class AppUploadModemComponent {
  snackBar: MatSnackBar = inject(MatSnackBar);
  private uploadRadiusModemService = inject(UploadRadiusModemService);
  types: string[] = ['XDSL', 'GPON'];
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;
  inputFileName: string = '';
  allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];
  type: string = '';
  selectedFile: File | null;

  constructor() {}

  onClickUpload() {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;
    if (
      this.allowedTypes.includes(file.type) ||
      file.name.endsWith('.xls') ||
      file.name.endsWith('.xlsx')
    ) {
      this.inputFileName = file.name;
      this.selectedFile = file;
      console.log('Selected file:', this.selectedFile);
    } else {
      console.error('Invalid file type');
    }
  }

  onSubmit(event: NgForm) {
    if (!this.selectedFile) {
      console.error('No file selected');
      return;
    }
    if (!this.type) {
      console.error('No type selected');
      return;
    }

    const formData = new FormData();
    formData.append('type', this.type);
    formData.append('excelFile', this.selectedFile, this.inputFileName);
    this.uploadRadiusModemService.uploadModems(formData).subscribe({
      next: (response) => {
        this.showSnackBar('List Uploaded Successfully', 'success');
      },
      error: (error) => {
        this.showSnackBar('Server Error', 'error');
      },
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
}
