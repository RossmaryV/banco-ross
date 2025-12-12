import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  ServiciosService,
  Servicio,
} from '../../../services/servicios.service';

@Component({
  selector: 'app-servicios-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './servicios-list.component.html',
  styleUrls: ['./servicios-list.component.scss'],
})
export class ServiciosListComponent implements OnInit {
  servicios: Servicio[] = [];
  loading = false;
  error: string | null = null;

  constructor(private serviciosService: ServiciosService) {}

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(): void {
    this.loading = true;
    this.error = null;

    this.serviciosService.getServicios().subscribe({
      next: (data) => {
        this.servicios = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar servicios';
        this.loading = false;
      },
    });
  }
}
