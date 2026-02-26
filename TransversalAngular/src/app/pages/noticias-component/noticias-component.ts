import { Component, inject, OnInit } from '@angular/core';
import { NoticiasInterface } from '../../interfaces/noticias-interface';
import { NoticiasService } from '../../service/noticias-service';
import { NoticiasCard } from "../../cards/noticias-card/noticias-card";

@Component({
  selector: 'app-noticias-component',
  imports: [NoticiasCard],
  templateUrl: './noticias-component.html',
  styleUrl: './noticias-component.css',
})
export class NoticiasComponent implements OnInit{

  noticiasArr: NoticiasInterface[];
  noticiasService = inject(NoticiasService);

  constructor(){
    this.noticiasArr=[];
  }

  async cargarNoticias(): Promise<any>{
    try{
      const response = await this.noticiasService.getAllNoticias();
      this.noticiasArr = response;
      return response;
    } catch (error){
      alert("error al cargar los gimnasios");
    }
  }

  async ngOnInit(): Promise<void>{
    await this.cargarNoticias();
  }


}
