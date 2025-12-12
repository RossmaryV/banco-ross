import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TarjetasService, Tarjeta } from '../../../services/tarjetas.service';

@Component({
  selector: 'app-tarjetas-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tarjetas-list.component.html',
  styleUrls: ['./tarjetas-list.component.scss'],
})
export class TarjetasListComponent implements OnInit {
  tarjetas: Tarjeta[] = [];
  loading = false;
  error: string | null = null;

  constructor(private tarjetasService: TarjetasService) {}

  ngOnInit(): void {
    this.cargarTarjetas();
  }

  cargarTarjetas(): void {
    this.loading = true;
    this.error = null;

    this.tarjetasService.getTarjetas().subscribe({
      next: (data) => {
        this.tarjetas = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar tarjetas';
        this.loading = false;
      },
    });
  }
}
