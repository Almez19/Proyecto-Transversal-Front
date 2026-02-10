import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { NoticiasInterface } from '../interfaces/noticias-interface';

@Injectable({
  providedIn: 'root',
})
export class NoticiasService {

  private httpClient = inject(HttpClient);

  baseURL: string = 'http://localhost:8080/api/noticias';

  private noticiasPromise!: Promise<NoticiasInterface[]>;

  private ultimasNoticiasPromise!: Promise<NoticiasInterface[]>;

  constructor() {
    this.cargarNoticias();
  }

  private cargarNoticias(): void {
    this.noticiasPromise = lastValueFrom(
      this.httpClient.get<NoticiasInterface[]>(this.baseURL)
    );
  }

  public getAllNoticias(): Promise<NoticiasInterface[]> {
    return this.noticiasPromise;
  }

  public getUltimasNoticias (): Promise<NoticiasInterface[]>{

    return this.noticiasPromise = lastValueFrom(
      this.httpClient.get<NoticiasInterface[]>(this.baseURL+"/ultimas")
    );

  }
}
