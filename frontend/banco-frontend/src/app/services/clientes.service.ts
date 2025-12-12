// src/app/services/clientes.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cliente {
  id: string;
  tipo_identificacion: 'cedula' | 'ruc' | 'pasaporte';
  numero_identificacion: string;
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string | null;
  nacionalidad: string;
  direccion: string | null;
  departamento: string | null;
  distrito: string | null;
  ciudad: string | null;
  telefono: string | null;
  email: string | null;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  estado: 'activo' | 'inactivo' | 'pendiente_verificacion';
}

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private baseUrl = 'http://localhost:3000/api/clientes';

  constructor(private http: HttpClient) {}

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.baseUrl);
  }

  getCliente(id: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.baseUrl}/${id}`);
  }

  createCliente(data: Partial<Cliente>): Observable<Cliente> {
    return this.http.post<Cliente>(this.baseUrl, data);
  }

  updateCliente(id: string, data: Partial<Cliente>): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.baseUrl}/${id}`, data);
  }
}
