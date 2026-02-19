import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  TransaccionesService,
  TipoTransaccion,
  Transaccion,
} from '../../../services/transacciones.service';

@Component({
  selector: 'app-transaccion-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './transaccion-form.component.html',
  styleUrls: ['./transaccion-form.component.scss'],
})
export class TransaccionFormComponent implements OnInit {
  form!: FormGroup;
  guardando = false;
  error: string | null = null;

  tipos: TipoTransaccion[] = [
    'deposito',
    'retiro',
    'transferencia',
    'pago_servicio',
    'consulta',
  ];

  monedas = ['PYG', 'USD'];

  constructor(
    private fb: FormBuilder,
    private transaccionesService: TransaccionesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      tipo_transaccion: ['', Validators.required],
      cuenta_origen_id: ['', Validators.required],
      cuenta_destino_id: [''],
      servicio_id: [''],
      cajero_id: [''],
      monto: [0, [Validators.required, Validators.min(0.01)]],
      moneda: ['PYG', Validators.required],
      descripcion: [''],
      referencia_pago: [''],
    });

    // Reglas dinámicas según el tipo
    this.form.get('tipo_transaccion')?.valueChanges.subscribe((tipo) => {
      this.actualizarValidadoresPorTipo(tipo as TipoTransaccion);
    });
  }

  actualizarValidadoresPorTipo(tipo: TipoTransaccion): void {
    const cuentaDestinoCtrl = this.form.get('cuenta_destino_id');
    const servicioCtrl = this.form.get('servicio_id');
    const referenciaCtrl = this.form.get('referencia_pago');
    const montoCtrl = this.form.get('monto');

    // reset validators
    cuentaDestinoCtrl?.clearValidators();
    servicioCtrl?.clearValidators();
    referenciaCtrl?.clearValidators();
    montoCtrl?.clearValidators();

    // monto casi siempre obligatorio (mantengo tu lógica)
    montoCtrl?.setValidators([Validators.required, Validators.min(0.01)]);

    if (tipo === 'transferencia') {
      cuentaDestinoCtrl?.setValidators([Validators.required]);
    } else {
      // limpieza para no enviar basura
      cuentaDestinoCtrl?.setValue('');
    }

    if (tipo === 'pago_servicio') {
      servicioCtrl?.setValidators([Validators.required]);
      referenciaCtrl?.setValidators([Validators.required]);
    } else {
      // limpieza para no enviar basura
      servicioCtrl?.setValue('');
      referenciaCtrl?.setValue('');
    }

    cuentaDestinoCtrl?.updateValueAndValidity();
    servicioCtrl?.updateValueAndValidity();
    referenciaCtrl?.updateValueAndValidity();
    montoCtrl?.updateValueAndValidity();
  }

  tieneError(campo: string, tipo: string): boolean {
    const control = this.form.get(campo);
    return !!control && control.hasError(tipo) && control.touched;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.error = null;

    const valores: any = { ...this.form.value };

    // ✅ Normalizar tipos (IDs y monto como number)
    valores.cuenta_origen_id = Number(valores.cuenta_origen_id);
    valores.cuenta_destino_id = valores.cuenta_destino_id
      ? Number(valores.cuenta_destino_id)
      : null;
    valores.servicio_id = valores.servicio_id ? Number(valores.servicio_id) : null;
    valores.cajero_id = valores.cajero_id ? Number(valores.cajero_id) : null;
    valores.monto = Number(valores.monto);

    const request$ =
      valores.tipo_transaccion === 'transferencia'
        ? this.transaccionesService.transferir({
            cuenta_origen_id: valores.cuenta_origen_id,
            cuenta_destino_id: valores.cuenta_destino_id,
            monto: valores.monto,
            descripcion: valores.descripcion,
          })
        : this.transaccionesService.createTransaccion(valores as Partial<Transaccion>);

    request$.subscribe({
      next: () => {
        this.guardando = false;
        window.alert('Transacción registrada correctamente');
        this.router.navigate(['/transacciones']);
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.message || 'Error al registrar la transacción';
        this.guardando = false;
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/transacciones']);
  }
}
