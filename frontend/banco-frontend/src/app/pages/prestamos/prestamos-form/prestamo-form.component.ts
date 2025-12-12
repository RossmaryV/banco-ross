import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PrestamosService, Prestamo } from '../../../services/prestamos.service';

@Component({
  selector: 'app-prestamo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './prestamo-form.component.html',
  styleUrls: ['./prestamo-form.component.scss'],
})
export class PrestamoFormComponent implements OnInit {
  form!: FormGroup;
  cargando = false;
  guardando = false;
  error: string | null = null;
  esEdicion = false;
  idPrestamo: string | null = null;

  estados = ['solicitado', 'aprobado', 'rechazado', 'pagado', 'moroso'];

  constructor(
    private fb: FormBuilder,
    private prestamosService: PrestamosService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      cliente_id: ['', Validators.required],
      cuenta_id: ['', Validators.required],
      monto_solicitado: [0, [Validators.required, Validators.min(0.01)]],
      monto_aprobado: [null, [Validators.min(0)]],
      tasa_interes: [0, [Validators.required, Validators.min(0)]],
      plazo_meses: [0, [Validators.required, Validators.min(1)]],
      cuota_mensual: [null],
      fecha_solicitud: [''],
      fecha_aprobacion: [''],
      fecha_vencimiento: [''],
      estado: ['solicitado', Validators.required],
      motivo_rechazo: [''],
    });

    // autocalculo simple de cuota_mensual cuando cambian monto_aprobado / tasa / plazo
    this.form.valueChanges.subscribe((values) => {
      const monto =
        values.monto_aprobado != null && values.monto_aprobado !== ''
          ? Number(values.monto_aprobado)
          : Number(values.monto_solicitado);
      const tasa = Number(values.tasa_interes);
      const plazo = Number(values.plazo_meses);

      if (monto > 0 && plazo > 0 && tasa >= 0) {
        const cuota = this.calcularCuotaMensual(monto, tasa, plazo);
        this.form.patchValue(
          { cuota_mensual: Math.round(cuota * 100) / 100 },
          { emitEvent: false }
        );
      }
    });

    this.idPrestamo = this.route.snapshot.paramMap.get('id');
    this.esEdicion = !!this.idPrestamo;

    if (this.esEdicion && this.idPrestamo) {
      this.cargarPrestamo(this.idPrestamo);
    }
  }

  calcularCuotaMensual(monto: number, tasaAnual: number, plazoMeses: number): number {
    const tasaMensual = tasaAnual / 100 / 12;

    if (!tasaMensual) {
      return monto / plazoMeses;
    }

    const factor = Math.pow(1 + tasaMensual, plazoMeses);
    return monto * ((tasaMensual * factor) / (factor - 1));
  }

  tieneError(campo: string, tipo: string): boolean {
    const control = this.form.get(campo);
    return !!control && control.hasError(tipo) && control.touched;
  }

  cargarPrestamo(id: string): void {
    this.cargando = true;
    this.prestamosService.getPrestamo(id).subscribe({
      next: (prestamo) => {
        let fecha_solicitud = prestamo.fecha_solicitud;
        let fecha_aprobacion = prestamo.fecha_aprobacion;
        let fecha_vencimiento = prestamo.fecha_vencimiento;

        if (fecha_solicitud && fecha_solicitud.includes('T')) {
          fecha_solicitud = fecha_solicitud.split('T')[0];
        }
        if (fecha_aprobacion && fecha_aprobacion.includes('T')) {
          fecha_aprobacion = fecha_aprobacion.split('T')[0];
        }
        if (fecha_vencimiento && fecha_vencimiento.includes('T')) {
          fecha_vencimiento = fecha_vencimiento.split('T')[0];
        }

        this.form.patchValue({
          ...prestamo,
          fecha_solicitud,
          fecha_aprobacion,
          fecha_vencimiento,
        });
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el préstamo';
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

    const valores = this.form.value as Partial<Prestamo>;

    const obs =
      this.esEdicion && this.idPrestamo
        ? this.prestamosService.updatePrestamo(this.idPrestamo, valores)
        : this.prestamosService.createPrestamo(valores);

    obs.subscribe({
      next: () => {
        this.guardando = false;
        const mensaje = this.esEdicion
          ? 'Préstamo actualizado correctamente'
          : 'Préstamo creado correctamente';
        window.alert(mensaje);
        this.router.navigate(['/prestamos']);
      },
      error: () => {
        this.error = 'Error al guardar el préstamo';
        this.guardando = false;
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/prestamos']);
  }
}
