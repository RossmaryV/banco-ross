import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type EstadoUsuario = 'activo' | 'inactivo' | 'bloqueado';

export interface UsuarioSistema {
  id: string;
  cliente_id: string | null;
  username: string;
  password_hash?: string; 
  rol_id: string;
  fecha_creacion?: string;
  fecha_ultimo_acceso?: string | null;
  estado: EstadoUsuario;
  intentos_fallidos: number;
  fecha_ultimo_cambio_password?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private baseUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<UsuarioSistema[]> {
    return this.http.get<UsuarioSistema[]>(this.baseUrl);
  }

  getUsuario(id: string): Observable<UsuarioSistema> {
    return this.http.get<UsuarioSistema>(`${this.baseUrl}/${id}`);
  }

  createUsuario(data: Partial<UsuarioSistema>): Observable<UsuarioSistema> {
    return this.http.post<UsuarioSistema>(this.baseUrl, data);
  }

  updateUsuario(
    id: string,
    data: Partial<UsuarioSistema>
  ): Observable<UsuarioSistema> {
    return this.http.put<UsuarioSistema>(`${this.baseUrl}/${id}`, data);
  }
}
