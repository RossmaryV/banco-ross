import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type TipoServicio = 'luz' | 'agua' | 'telefonia' | 'impuestos';

export interface Servicio {
  id: string;
  nombre_servicio: string;
  codigo_servicio: string;
  tipo_servicio: TipoServicio;
  estado: 'activo' | 'inactivo';
}

@Injectable({
  providedIn: 'root',
})
export class ServiciosService {
  private baseUrl = 'http://localhost:3000/api/servicios';

  constructor(private http: HttpClient) {}

  getServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.baseUrl);
  }

  getServicio(id: string): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.baseUrl}/${id}`);
  }

  createServicio(data: Partial<Servicio>): Observable<Servicio> {
    return this.http.post<Servicio>(this.baseUrl, data);
  }

  updateServicio(id: string, data: Partial<Servicio>): Observable<Servicio> {
    return this.http.put<Servicio>(`${this.baseUrl}/${id}`, data);
  }
}
