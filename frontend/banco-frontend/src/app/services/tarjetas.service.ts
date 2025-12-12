import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Tarjeta {
  id: string;
  cuenta_id: string;
  numero_tarjeta: string;
  tipo_tarjeta: 'debito' | 'credito';
  fecha_emision: string;
  fecha_vencimiento: string;
  codigo_seguridad: string | null;
  limite_credito: number;
  limite_diario_retiro: number;
  estado: 'activa' | 'bloqueada' | 'vencida' | 'reportada';
}

@Injectable({
  providedIn: 'root',
})
export class TarjetasService {
  private baseUrl = 'http://localhost:3000/api/tarjetas';

  constructor(private http: HttpClient) {}

  getTarjetas(): Observable<Tarjeta[]> {
    return this.http.get<Tarjeta[]>(this.baseUrl);
  }

  getTarjeta(id: string): Observable<Tarjeta> {
    return this.http.get<Tarjeta>(`${this.baseUrl}/${id}`);
  }

  createTarjeta(data: Partial<Tarjeta>): Observable<Tarjeta> {
    return this.http.post<Tarjeta>(this.baseUrl, data);
  }

  updateTarjeta(id: string, data: Partial<Tarjeta>): Observable<Tarjeta> {
    return this.http.put<Tarjeta>(`${this.baseUrl}/${id}`, data);
  }
}
