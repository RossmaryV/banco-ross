import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CuentasService, Cuenta } from '../../../services/cuentas.service';

@Component({
  selector: 'app-cuenta-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './cuentas-form.component.html',
  styleUrls: ['./cuentas-form.component.scss'],
})
export class CuentaFormComponent implements OnInit {
  form!: FormGroup;
  cargando = false;
  guardando = false;
  error: string | null = null;
  esEdicion = false;
  idCuenta: string | null = null;

  tiposCuenta = ['caja_ahorro', 'cuenta_corriente'];
  monedas = ['PYG', 'USD'];
  estados = ['activa', 'inactiva'];

  constructor(
    private fb: FormBuilder,
    private cuentasService: CuentasService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      cliente_id: ['', Validators.required],
      numero_cuenta: ['', Validators.required],
      tipo_cuenta: ['', Validators.required],
      saldo_actual: [0, [Validators.required, Validators.min(0)]],
      saldo_disponible: [0, [Validators.required, Validators.min(0)]],
      moneda: ['', Validators.required],
      fecha_apertura: [''], // opcional, el backend puede poner la actual
      fecha_cierre: [''],
      estado: ['activa', Validators.required],
      limite_transferencia: [0, [Validators.required, Validators.min(0)]],
    });

    this.idCuenta = this.route.snapshot.paramMap.get('id');
    this.esEdicion = !!this.idCuenta;

    if (this.esEdicion && this.idCuenta) {
      this.cargarCuenta(this.idCuenta);
    }
  }

  tieneError(campo: string, tipo: string): boolean {
    const control = this.form.get(campo);
    return !!control && control.hasError(tipo) && control.touched;
  }

  cargarCuenta(id: string): void {
    this.cargando = true;
    this.cuentasService.getCuenta(id).subscribe({
      next: (cuenta) => {
        let fecha_apertura = cuenta.fecha_apertura;
        let fecha_cierre = cuenta.fecha_cierre;

        if (fecha_apertura && fecha_apertura.includes('T')) {
          fecha_apertura = fecha_apertura.split('T')[0];
        }
        if (fecha_cierre && fecha_cierre.includes('T')) {
          fecha_cierre = fecha_cierre.split('T')[0];
        }

        this.form.patchValue({
          ...cuenta,
          fecha_apertura,
          fecha_cierre,
        });
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo cargar la cuenta';
        this.cargando = false;
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.error = null;

    const valores = this.form.value as Partial<Cuenta>;

    const obs =
      this.esEdicion && this.idCuenta
        ? this.cuentasService.updateCuenta(this.idCuenta, valores)
        : this.cuentasService.createCuenta(valores);

    obs.subscribe({
      next: () => {
        this.guardando = false;
        const mensaje = this.esEdicion
          ? 'Cuenta actualizada correctamente'
          : 'Cuenta creada correctamente';
        window.alert(mensaje);
        this.router.navigate(['/cuentas']);
      },
      error: () => {
        this.error = 'Error al guardar la cuenta';
        this.guardando = false;
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/cuentas']);
  }
}
