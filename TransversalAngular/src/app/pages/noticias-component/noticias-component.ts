import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { NoticiasInterface } from '../../interfaces/noticias-interface';
import { NoticiasService } from '../../service/noticias-service';
import { NoticiasCard } from "../../cards/noticias-card/noticias-card";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-noticias-component',
  imports: [NoticiasCard, FormsModule, CommonModule],
  templateUrl: './noticias-component.html',
  styleUrl: './noticias-component.css',
})
export class NoticiasComponent implements OnInit {

  noticiasArr: NoticiasInterface[] = [];
  noticiasFiltradas: NoticiasInterface[] = [];

  noticiasService = inject(NoticiasService);
  cdr = inject(ChangeDetectorRef);

  searchTitulo: string = '';
  searchFecha: string = '';

  async cargarNoticias(): Promise<any> {
    try {
      const response = await this.noticiasService.getAllNoticias();
      this.noticiasArr = response;
      this.noticiasFiltradas = response;
      this.cdr.detectChanges();
      return response;
    } catch (error) {
      alert("error al cargar las noticias");
    }
  }

  filtrar(): void {
    this.noticiasFiltradas = this.noticiasArr.filter(n => {

      const coincideTitulo = n.titulo.toLowerCase()
        .includes(this.searchTitulo.toLowerCase());

      const coincideFecha = this.searchFecha
        ? new Date(n.fecha).toISOString().slice(0, 10) === this.searchFecha
        : true;

      return coincideTitulo && coincideFecha;
    });

    this.cdr.detectChanges();
  }

  limpiarFiltros(): void {
    this.searchTitulo = '';
    this.searchFecha = '';
    this.noticiasFiltradas = this.noticiasArr;
    this.cdr.detectChanges();
  }

  async ngOnInit(): Promise<void> {
    await this.cargarNoticias();
  }

}