// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { ClientesListComponent } from './pages/clientes/clientes-list/clientes-list.component';
import { ClienteFormComponent } from './pages/clientes/cliente-form/cliente-form.component';
import { CuentasListComponent } from './pages/cuentas/cuentas-list/cuentas-list.component';
import { CuentaFormComponent } from './pages/cuentas/cuentas-form/cuentas-form.component';
import { TarjetasListComponent } from './pages/tarjetas/tarjetas-list/tarjetas-list.component';
import { TarjetaFormComponent } from './pages/tarjetas/tarjetas-form/tarjeta-form.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PrestamosListComponent } from './pages/prestamos/prestamos-list/prestamos-list.component';
import { PrestamoFormComponent } from './pages/prestamos/prestamos-form/prestamo-form.component';
import { TransaccionesListComponent } from './pages/transacciones/transacciones-list/transacciones-list.component';
import { TransaccionFormComponent } from './pages/transacciones/transacciones-form/transaccion-form.component';
import { ServiciosListComponent } from './pages/servicios/servicios-list/servicios-list.component';
import { ServicioFormComponent } from './pages/servicios/servicios-form/servicio-form.component';
import { CajerosListComponent } from './pages/cajeros/cajeros-list/cajeros-list.component';
import { CajeroFormComponent } from './pages/cajeros/cajeros-form/cajero-form.component';
import { UsuariosListComponent } from './pages/usuarios/usuarios-list/usuarios-list.component';
import { UsuarioFormComponent } from './pages/usuarios/usuarios-form/usuario-form.component';
import { LoginComponent } from './pages/auth/login/login.component';

export const routes: Routes = [
  // 👉 1) Cuando entra a "/" siempre va al login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 👉 2) Pantalla de login
  { path: 'login', component: LoginComponent },

  // 👉 3) Dashboard (después de loguearse)
  { path: 'dashboard', component: DashboardComponent },

  // 👉 4) Clientes
  { path: 'clientes', component: ClientesListComponent },
  { path: 'clientes/nuevo', component: ClienteFormComponent },
  { path: 'clientes/:id/editar', component: ClienteFormComponent },

  // 👉 5) Cuentas
  { path: 'cuentas', component: CuentasListComponent },
  { path: 'cuentas/nuevo', component: CuentaFormComponent },
  { path: 'cuentas/:id/editar', component: CuentaFormComponent },

  // 👉 6) Tarjetas
  { path: 'tarjetas', component: TarjetasListComponent },
  { path: 'tarjetas/nuevo', component: TarjetaFormComponent },
  { path: 'tarjetas/:id/editar', component: TarjetaFormComponent },

  // 👉 7) Préstamos
  { path: 'prestamos', component: PrestamosListComponent },
  { path: 'prestamos/nuevo', component: PrestamoFormComponent },
  { path: 'prestamos/:id/editar', component: PrestamoFormComponent },

  // 👉 8) Transacciones
  { path: 'transacciones', component: TransaccionesListComponent },
  { path: 'transacciones/nuevo', component: TransaccionFormComponent },

  // 👉 9) Servicios
  { path: 'servicios', component: ServiciosListComponent },
  { path: 'servicios/nuevo', component: ServicioFormComponent },
  { path: 'servicios/:id/editar', component: ServicioFormComponent },

  // 👉 10) Cajeros
  { path: 'cajeros', component: CajerosListComponent },
  { path: 'cajeros/nuevo', component: CajeroFormComponent },
  { path: 'cajeros/:id/editar', component: CajeroFormComponent },

  // 👉 11) Usuarios del sistema
  { path: 'usuarios', component: UsuariosListComponent },
  { path: 'usuarios/nuevo', component: UsuarioFormComponent },
  { path: 'usuarios/:id/editar', component: UsuarioFormComponent },

  // 👉 12) Cualquier ruta desconocida → login
  { path: '**', redirectTo: 'login' },
];
