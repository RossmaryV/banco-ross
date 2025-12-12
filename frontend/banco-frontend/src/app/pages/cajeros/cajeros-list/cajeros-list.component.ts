import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  CajerosService,
  Cajero,
} from '../../../services/cajeros.service';

@Component({
  selector: 'app-cajeros-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cajeros-list.component.html',
  styleUrls: ['./cajeros-list.component.scss'],
})
export class CajerosListComponent implements OnInit {
  cajeros: Cajero[] = [];
  loading = false;
  error: string | null = null;

  constructor(private cajerosService: CajerosService) {}

  ngOnInit(): void {
    this.cargarCajeros();
  }

  cargarCajeros(): void {
    this.loading = true;
    this.error = null;

    this.cajerosService.getCajeros().subscribe({
      next: (data) => {
        this.cajeros = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar cajeros automáticos';
        this.loading = false;
      },
    });
  }
}
