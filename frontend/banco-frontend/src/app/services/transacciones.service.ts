import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type TipoTransaccion =
  | 'retiro'
  | 'deposito'
  | 'transferencia'
  | 'pago_servicio'
  | 'consulta';

export interface Transaccion {
  id: string;
  tipo_transaccion: TipoTransaccion;
  cuenta_origen_id: string;
  cuenta_destino_id: string | null;
  cajero_id: string | null;
  servicio_id: string | null;
  monto: number;
  moneda: 'PYG' | 'USD';
  fecha_hora_transaccion: string;
  descripcion: string | null;
  estado: 'completada' | 'pendiente' | 'rechazada' | 'reversada';
  codigo_autorizacion: string | null;
  referencia_pago: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class TransaccionesService {
  // Asegurate que coincida con el puerto real de tu backend
  private baseUrl = 'http://localhost:3000/api/transacciones';

  constructor(private http: HttpClient) {}

  getTransacciones(): Observable<Transaccion[]> {
    return this.http.get<Transaccion[]>(this.baseUrl);
  }

  getTransaccion(id: string): Observable<Transaccion> {
    return this.http.get<Transaccion>(`${this.baseUrl}/${id}`);
  }

  createTransaccion(data: Partial<Transaccion>): Observable<Transaccion> {
    return this.http.post<Transaccion>(this.baseUrl, data);
  }

  // ✅ ESTE es el método que te falta para que no salga el error
  transferir(payload: {
    cuenta_origen_id: number;
    cuenta_destino_id: number;
    monto: number;
    descripcion?: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/transferir`, payload);
  }
}
