import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PrestamosService, Prestamo } from '../../../services/prestamos.service';

@Component({
  selector: 'app-prestamos-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './prestamos-list.component.html',
  styleUrls: ['./prestamos-list.component.scss'],
})
export class PrestamosListComponent implements OnInit {
  prestamos: Prestamo[] = [];
  loading = false;
  error: string | null = null;

  constructor(private prestamosService: PrestamosService) {}

  ngOnInit(): void {
    this.cargarPrestamos();
  }

  cargarPrestamos(): void {
    this.loading = true;
    this.error = null;

    this.prestamosService.getPrestamos().subscribe({
      next: (data) => {
        this.prestamos = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar préstamos';
        this.loading = false;
      },
    });
  }
}
