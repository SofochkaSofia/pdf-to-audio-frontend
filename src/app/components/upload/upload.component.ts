import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service'; // Используем ApiService
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule,
    NgIf
  ],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  file: File | null = null;
  isLoading = false;
  audioUrl: string | null = null;

  constructor(private apiService: ApiService) {} // Используем ApiService

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.file) {
      this.isLoading = true;
      const formData = new FormData();
      formData.append('file', this.file);

      // Используем ApiService для загрузки файла
      this.apiService.upload(formData).subscribe(
        response => {
          this.audioUrl = response.audioUrl; // Предполагаем, что сервер возвращает URL аудио
          this.isLoading = false;
        },
        error => {
          console.error('Ошибка загрузки файла:', error);
          this.isLoading = false;
        }
      );
    }
  }
}
