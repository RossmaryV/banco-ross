import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Prestamo {
  id: string;
  cliente_id: string;
  cuenta_id: string;
  monto_solicitado: number;
  monto_aprobado: number | null;
  tasa_interes: number;
  plazo_meses: number;
  cuota_mensual: number | null;
  fecha_solicitud: string;
  fecha_aprobacion: string | null;
  fecha_vencimiento: string | null;
  estado: 'solicitado' | 'aprobado' | 'rechazado' | 'pagado' | 'moroso';
  motivo_rechazo: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class PrestamosService {
  private baseUrl = 'http://localhost:3000/api/prestamos';

  constructor(private http: HttpClient) {}

  getPrestamos(): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(this.baseUrl);
  }

  getPrestamo(id: string): Observable<Prestamo> {
    return this.http.get<Prestamo>(`${this.baseUrl}/${id}`);
  }

  createPrestamo(data: Partial<Prestamo>): Observable<Prestamo> {
    return this.http.post<Prestamo>(this.baseUrl, data);
  }

  updatePrestamo(id: string, data: Partial<Prestamo>): Observable<Prestamo> {
    return this.http.put<Prestamo>(`${this.baseUrl}/${id}`, data);
  }
}
