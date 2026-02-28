import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ClientesService } from '../../service/clientes-service';
import { ClienteInterface } from '../../interfaces/cliente-interface';

@Component({
  selector: 'app-perfil-datos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-datos.html',
  styleUrl: './perfil-datos.css',
})
export class PerfilDatosComponent implements OnInit {
  private clientes = inject(ClientesService);
  private cdr = inject(ChangeDetectorRef);

  cargando = true;
  guardando = false;
  error = '';
  mensaje = '';

  perfil: ClienteInterface | null = null;

  // formulario
  nombre = '';
  apellido1 = '';
  apellido2 = '';
  email = '';
  dniNie = '';
  telefono = '';
  ciudad = '';
  fechaNacimiento = '';

  // password
  passActual = '';
  passNueva = '';
  passNueva2 = '';

  async ngOnInit(): Promise<void> {
    await this.cargar();
  }

  async cargar(): Promise<void> {
    this.cargando = true;
    this.error = '';
    this.mensaje = '';
    try {
      const p = await this.clientes.getMiPerfil();
      this.perfil = p;

      this.nombre = p.nombre ?? '';
      this.apellido1 = p.apellido1 ?? '';
      this.apellido2 = p.apellido2 ?? '';
      this.email = p.email ?? '';
      this.dniNie = (p.dniNie ?? p.dni_nie ?? '') as string;
      this.telefono = (p.telefono ?? '') as string;
      this.ciudad = (p.ciudad ?? '') as string;
      this.fechaNacimiento = (p.fechaNacimiento ?? p.fecha_nacimiento ?? '') as string;
    } catch (e: any) {
      this.error = e?.error?.message ?? e?.message ?? 'No se pudieron cargar tus datos.';
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  async guardarDatos(): Promise<void> {
    this.error = '';
    this.mensaje = '';
    if (!this.perfil) return;

    if (!this.nombre.trim() || !this.apellido1.trim() || !this.apellido2.trim()) {
      this.error = 'Nombre y apellidos son obligatorios.';
      return;
    }
    if (!this.dniNie.trim()) {
      this.error = 'DNI/NIE es obligatorio.';
      return;
    }

    this.guardando = true;
    try {
      const actualizado = await this.clientes.actualizarMiPerfil({
        nombre: this.nombre.trim(),
        apellido1: this.apellido1.trim(),
        apellido2: this.apellido2.trim(),
        dniNie: this.dniNie.trim(),
        telefono: this.telefono?.trim() || null,
        ciudad: this.ciudad?.trim() || null,
        fechaNacimiento: this.fechaNacimiento || null,
      });
      this.perfil = actualizado;
      this.mensaje = 'Datos actualizados correctamente.';
    } catch (e: any) {
      this.error = e?.error?.message ?? e?.message ?? 'No se pudieron guardar los cambios.';
    } finally {
      this.guardando = false;
      this.cdr.detectChanges();
    }
  }

  async cambiarPassword(): Promise<void> {
    this.error = '';
    this.mensaje = '';
    if (!this.passActual || !this.passNueva) {
      this.error = 'Rellena la contraseña actual y la nueva.';
      return;
    }
    if (this.passNueva !== this.passNueva2) {
      this.error = 'La nueva contraseña no coincide.';
      return;
    }
    if (this.passNueva.length < 6) {
      this.error = 'La nueva contraseña debe tener al menos 6 caracteres.';
      return;
    }

    this.guardando = true;
    try {
      await this.clientes.cambiarContrasena(this.passActual, this.passNueva);
      this.mensaje = 'Contraseña actualizada.';
      this.passActual = '';
      this.passNueva = '';
      this.passNueva2 = '';
    } catch (e: any) {
      this.error = e?.error?.message ?? e?.message ?? 'No se pudo cambiar la contraseña.';
    } finally {
      this.guardando = false;
      this.cdr.detectChanges();
    }
  }
}
