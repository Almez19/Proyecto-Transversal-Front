import { Injectable } from '@angular/core';
import { NoticiasInterface } from '../interfaces/noticias-interface';
import { UUIDTypes } from "uuid";
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class NoticiasService {
  
  mockNoticias: NoticiasInterface[] = [

      {
        id: uuidv4(),
        titulo: 'Nueva zona de entrenamiento funcional',
        cuerpo: 'Basic-Fit incorpora una nueva zona de entrenamiento funcional equipada con material de última generación para mejorar fuerza, resistencia y movilidad.',
        urlImagen: 'https://www.basic-fit.com/on/demandware.static/-/Library-Sites-basic-fit-shared-library/default/dwc387891c/Landscape-BasicFit%20Tilburg%2026-8-2113386.jpeg',
        fecha: new Date('2025-01-15'),
        gimnasioId: uuidv4()
      },

      {
        id: uuidv4(),
        titulo: 'Clases colectivas virtuales renovadas',
        cuerpo: 'Actualizamos nuestras clases colectivas virtuales con nuevos entrenamientos guiados por expertos para todos los niveles.',
        urlImagen: 'https://www.gimnasios.es/im/media/YTo0OntzOjI6ImlkIjtpOjE0MTYyMjtzOjE6InciO2k6MzAwO3M6MToiaCI7aTozMDA7czoxOiJ0IjtzOjIzOiJwcm9maWxlLWNhcm91c2VsLXNsaWRlciI7fQ==',
        fecha: new Date('2025-01-22'),
        gimnasioId: uuidv4()
      },

      {
        id: uuidv4(),
        titulo: 'Horario ampliado los fines de semana',
        cuerpo: 'Ahora puedes entrenar más tiempo. Basic-Fit amplía su horario los fines de semana para adaptarse mejor a tu ritmo de vida.',
        urlImagen: 'https://revistacentroscomerciales.com/media/images/BasicFit_Andalucia_1_1.width-800.jpg',
        fecha: new Date('2025-02-01'),
        gimnasioId: uuidv4()
      }

  ];

  public getUltimasNoticias (): NoticiasInterface[]{

    return this.mockNoticias;


  }


}
