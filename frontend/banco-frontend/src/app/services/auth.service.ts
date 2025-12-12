import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AuthUser {
  id: string;
  cliente_id: string | null;
  username: string;
  rol_id: string;
  fecha_creacion: string;
  fecha_ultimo_acceso: string | null;
  estado: 'activo' | 'inactivo' | 'bloqueado';
  intentos_fallidos: number;
  fecha_ultimo_cambio_password: string | null;
}

export interface LoginResponse {
  message: string;
  user: AuthUser;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api';
  private storageKey = 'banco-usuario';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/login`, { username, password })
      .pipe(
        tap((resp) => {
          // guardamos el usuario en localStorage para “simular” sesión
          localStorage.setItem(this.storageKey, JSON.stringify(resp.user));
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
  }

  getUsuarioActual(): AuthUser | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }

  estaLogueado(): boolean {
    return this.getUsuarioActual() !== null;
  }
}
