import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { ClientesService } from '../../service/clientes-service';
import { ClienteInterface } from '../../interfaces/cliente-interface';

@Component({
  selector: 'app-perfil-component',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './perfil-component.html',
  styleUrl: './perfil-component.css',
})
export class PerfilComponent implements OnInit {
  private clientes = inject(ClientesService);
  private cdr = inject(ChangeDetectorRef);

  cargando = true;
  error = '';
  perfil: ClienteInterface | null = null;

  async ngOnInit(): Promise<void> {
    this.cargando = true;
    this.error = '';
    try {
      this.perfil = await this.clientes.getMiPerfil();
    } catch (e: any) {
      // El perfil sigue funcionando aunque falle (por ejemplo si no eres cliente)
      this.perfil = null;
      this.error = e?.message ?? '';
    } finally {
      this.cargando = false;
      // Alineado con el patrón de Gimnasios/Noticias: fuerza refresco tras async
      this.cdr.detectChanges();
    }
  }
}
