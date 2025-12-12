import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuCard {
  titulo: string;
  descripcion: string;
  icono: string;      // por ahora emoji simple
  ruta: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  cards: MenuCard[] = [
    {
      titulo: 'Clientes',
      descripcion: 'Gestión de alta, edición y consulta de clientes.',
      icono: '👤',
      ruta: '/clientes',
    },
    {
      titulo: 'Cuentas',
      descripcion: 'Apertura y administración de cuentas bancarias.',
      icono: '🏦',
      ruta: '/cuentas',
    },
    {
      titulo: 'Tarjetas',
      descripcion: 'Emisión y control de tarjetas de débito y crédito.',
      icono: '💳',
      ruta: '/tarjetas',
    },
     {
      titulo: 'Préstamos',
      descripcion: 'Simulación y gestión de préstamos.',
      icono: '💰',
      ruta: '/prestamos',
    },

    {
      titulo: 'Transacciones',
      descripcion: 'Depósitos, retiros, transferencias y pagos.',
      icono: '🔁',
      ruta: '/transacciones',
    },
        {
      titulo: 'Servicios',
      descripcion: 'Administración de servicios para pagos.',
      icono: '🧾',
      ruta: '/servicios',
    },

    {
      titulo: 'Cajeros',
      descripcion: 'Administración y estado de los cajeros.',
      icono: '🏧',
      ruta: '/cajeros',
    },



    // Más adelante: préstamos, transacciones, etc.
    // { titulo: 'Préstamos', descripcion: '...', icono: '💰', ruta: '/prestamos' },
  ];
}
