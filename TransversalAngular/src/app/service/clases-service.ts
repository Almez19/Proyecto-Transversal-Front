import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { UUIDTypes } from 'uuid';
import { ClaseInterface } from '../interfaces/clase-interface';

@Injectable({
  providedIn: 'root',
})
export class ClasesService {

  private httpClient = inject(HttpClient);

  private baseURL: string = 'http://localhost:8080/api/clases';

  private clasesPromise!: Promise<ClaseInterface[]>;

  constructor() {
    this.cargarClases();
  }

  private cargarClases(): void {
    this.clasesPromise = lastValueFrom(
      this.httpClient.get<ClaseInterface[]>(this.baseURL)
    );
  }

  public getAllClases(): Promise<ClaseInterface[]> {
    this.cargarClases();

    return this.clasesPromise;
  }

  async getClaseById(id: UUIDTypes | string): Promise<ClaseInterface> {

    return lastValueFrom(this.httpClient.get<ClaseInterface>(`${this.baseURL}/${id}`));

  }
}
