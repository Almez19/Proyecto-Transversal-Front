import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthPublicService } from '../../service/auth-public-service';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class RegistroComponent {
  private authPublic = inject(AuthPublicService);

  procesando = false;
  error = '';
  mensaje = '';

  nombre = '';
  apellidos = '';
  email = '';
  dniNie = '';
  password = '';
  password2 = '';

  async registrar(): Promise<void> {
    this.error = '';
    this.mensaje = '';

    if (!this.nombre.trim() || !this.apellidos.trim() || !this.email.trim() || !this.dniNie.trim()) {
      this.error = 'Rellena todos los campos.';
      return;
    }
    if (this.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }
    if (this.password !== this.password2) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    this.procesando = true;
    try {
      await this.authPublic.registrarCliente({
        nombre: this.nombre.trim(),
        apellidos: this.apellidos.trim(),
        email: this.email.trim(),
        dniNie: this.dniNie.trim(),
        password: this.password,
      });
      this.mensaje = 'Cuenta creada. Ya puedes iniciar sesión.';
    } catch (error: any) {
      this.error =
        error?.message ??
        'No se pudo registrar. Revisa que exista el endpoint POST /auth/registro en el backend.';
    } finally {
      this.procesando = false;
    }
  }
}
