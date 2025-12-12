import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  TransaccionesService,
  Transaccion,
} from '../../../services/transacciones.service';

@Component({
  selector: 'app-transacciones-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './transacciones-list.component.html',
  styleUrls: ['./transacciones-list.component.scss'],
})
export class TransaccionesListComponent implements OnInit {
  transacciones: Transaccion[] = [];
  loading = false;
  error: string | null = null;

  constructor(private transaccionesService: TransaccionesService) {}

  ngOnInit(): void {
    this.cargarTransacciones();
  }

  cargarTransacciones(): void {
    this.loading = true;
    this.error = null;

    this.transaccionesService.getTransacciones().subscribe({
      next: (data) => {
        this.transacciones = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar transacciones';
        this.loading = false;
      },
    });
  }
}
