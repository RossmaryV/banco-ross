import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cuenta {
  id: string;
  cliente_id: string;
  numero_cuenta: string;
  tipo_cuenta: 'caja_ahorro' | 'cuenta_corriente';
  saldo_actual: number;
  saldo_disponible: number;
  moneda: 'PYG' | 'USD';
  fecha_apertura: string | null;
  fecha_cierre: string | null;
  estado: 'activa' | 'inactiva';
  limite_transferencia: number;
}

@Injectable({
  providedIn: 'root',
})
export class CuentasService {
  private baseUrl = 'http://localhost:3000/api/cuentas';

  constructor(private http: HttpClient) {}

  getCuentas(): Observable<Cuenta[]> {
    return this.http.get<Cuenta[]>(this.baseUrl);
  }

  getCuenta(id: string): Observable<Cuenta> {
    return this.http.get<Cuenta>(`${this.baseUrl}/${id}`);
  }

  createCuenta(data: Partial<Cuenta>): Observable<Cuenta> {
    return this.http.post<Cuenta>(this.baseUrl, data);
  }

  updateCuenta(id: string, data: Partial<Cuenta>): Observable<Cuenta> {
    return this.http.put<Cuenta>(`${this.baseUrl}/${id}`, data);
  }
}
