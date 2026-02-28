import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthPublicService } from '../../service/auth-public-service';

@Component({
  selector: 'app-recuperar-contrasena',
  imports: [FormsModule, RouterLink],
  templateUrl: './recuperar-contrasena.html',
  styleUrl: './recuperar-contrasena.css',
})
export class RecuperarContrasenaComponent {
  private authPublic = inject(AuthPublicService);

  procesando = false;
  error = '';
  mensaje = '';

  email = '';

  async enviar(): Promise<void> {
    this.error = '';
    this.mensaje = '';

    if (!this.email.trim()) {
      this.error = 'Introduce tu email.';
      return;
    }

    this.procesando = true;
    try {
      await this.authPublic.solicitarResetPassword(this.email.trim());
      this.mensaje = 'Si el email existe, recibirás instrucciones para restablecer la contraseña.';
    } catch (error: any) {
      this.error =
        error?.message ??
        'No se pudo enviar la solicitud. Revisa que exista el endpoint POST /auth/recuperar-contrasena.';
    } finally {
      this.procesando = false;
    }
  }
}
