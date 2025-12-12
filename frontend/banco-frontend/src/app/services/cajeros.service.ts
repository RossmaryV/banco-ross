import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type EstadoCajero = 'operativo' | 'mantenimiento' | 'fuera_servicio';

export interface Cajero {
  id: string;
  codigo_cajero: string;
  ubicacion: string;
  saldo_efectivo_disponible: number;
  denominaciones_disponibles: any; // puede ser objeto o string
  estado: EstadoCajero;
  fecha_ultimo_abastecimiento: string | null;
  fecha_ultimo_mantenimiento: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class CajerosService {
  private baseUrl = 'http://localhost:3000/api/cajeros';

  constructor(private http: HttpClient) {}

  getCajeros(): Observable<Cajero[]> {
    return this.http.get<Cajero[]>(this.baseUrl);
  }

  getCajero(id: string): Observable<Cajero> {
    return this.http.get<Cajero>(`${this.baseUrl}/${id}`);
  }

  createCajero(data: Partial<Cajero>): Observable<Cajero> {
    return this.http.post<Cajero>(this.baseUrl, data);
  }

  updateCajero(id: string, data: Partial<Cajero>): Observable<Cajero> {
    return this.http.put<Cajero>(`${this.baseUrl}/${id}`, data);
  }
}
