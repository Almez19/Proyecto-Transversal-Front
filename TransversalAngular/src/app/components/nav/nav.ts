import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth-service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  private auth = inject(AuthService);
  private router = inject(Router);

  get logueado(): boolean {
    return this.auth.estaLogueado();
  }

  get esCliente(): boolean {
    return this.auth.esCliente();
  }

  get esStaff(): boolean {
    return this.auth.esStaff();
  }

  cerrarSesion(): void {
    this.auth.cerrarSesion();
    this.router.navigateByUrl('/home');
  }
}
