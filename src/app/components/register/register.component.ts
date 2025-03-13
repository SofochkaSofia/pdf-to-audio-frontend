import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ApiService } from '../../services/api.service'; // Используем ApiService
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService, // Используем ApiService
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordValidator]], // Подключите валидатор
      consent: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    // Подписка на изменения поля пароля
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.registerForm.get('password')?.markAsTouched();
    });
  }

  passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (!value) {
      return null; // Если поле пустое, не показываем ошибку (это сделает Validators.required)
    }
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isValid = value.length >= 8 && hasNumber && hasSpecialChar;
    return isValid ? null : { invalidPassword: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.apiService.register(this.registerForm.value).subscribe(
        response => {
          this.router.navigate(['/login']);
        },
        error => {
          this.snackBar.open('Ошибка регистрации. Проверьте данные и попробуйте снова.', 'Закрыть', {
            duration: 3000,
          });
        }
      );
    }
  }
}
