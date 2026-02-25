import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../service/login-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {

  loginService = inject(LoginService);
  router = inject(Router);

  modelForm: FormGroup;

  constructor() {
    this.modelForm = new FormGroup({
      email: new FormControl(null, [Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),]),
      contrasena: new FormControl(null, [Validators.required,Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&._-])[A-Za-z\\d@$!%*?&._-]{8,}$'),]),


    });
  }

  getDataForm() {
    if (this.modelForm.invalid) return;

    const credenciales = {email: this.modelForm.value.email, contrasena: this.modelForm.value.contrasena
    };

    this.loginService.login(credenciales).subscribe({
      next: () => {
        this.loginService.isLoggedIn = true;
        this.router.navigateByUrl('/');
      },

      error: () => {
        alert('Login incorrecto. Revisa email/contraseña.');
      }
    });
  }
}
