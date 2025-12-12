import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CuentasService, Cuenta } from '../../../services/cuentas.service';

@Component({
  selector: 'app-cuentas-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cuentas-list.component.html',
  styleUrls: ['./cuentas-list.component.scss'],
})
export class CuentasListComponent implements OnInit {
  cuentas: Cuenta[] = [];
  loading = false;
  error: string | null = null;

  constructor(private cuentasService: CuentasService) {}

  ngOnInit(): void {
    this.cargarCuentas();
  }

  cargarCuentas(): void {
    this.loading = true;
    this.error = null;

    this.cuentasService.getCuentas().subscribe({
      next: (data) => {
        this.cuentas = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar cuentas';
        this.loading = false;
      },
    });
  }
}
