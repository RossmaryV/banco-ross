import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TarjetasService, Tarjeta } from '../../../services/tarjetas.service';

@Component({
  selector: 'app-tarjeta-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './tarjeta-form.component.html',
  styleUrls: ['./tarjeta-form.component.scss'],
})
export class TarjetaFormComponent implements OnInit {
  form!: FormGroup;
  cargando = false;
  guardando = false;
  error: string | null = null;
  esEdicion = false;
  idTarjeta: string | null = null;

  tiposTarjeta = ['debito', 'credito'];
  estados = ['activa', 'bloqueada', 'vencida', 'reportada'];

  constructor(
    private fb: FormBuilder,
    private tarjetasService: TarjetasService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      cuenta_id: ['', Validators.required],
      numero_tarjeta: ['', Validators.required],
      tipo_tarjeta: ['', Validators.required],
      fecha_emision: ['', Validators.required],
      fecha_vencimiento: ['', Validators.required],
      codigo_seguridad: [''],
      limite_credito: [0, [Validators.min(0)]],
      limite_diario_retiro: [0, [Validators.min(0)]],
      estado: ['activa', Validators.required],
    });

    this.idTarjeta = this.route.snapshot.paramMap.get('id');
    this.esEdicion = !!this.idTarjeta;

    if (this.esEdicion && this.idTarjeta) {
      this.cargarTarjeta(this.idTarjeta);
    }
  }

  tieneError(campo: string, tipo: string): boolean {
    const control = this.form.get(campo);
    return !!control && control.hasError(tipo) && control.touched;
  }

  cargarTarjeta(id: string): void {
    this.cargando = true;
    this.tarjetasService.getTarjeta(id).subscribe({
      next: (tarjeta) => {
        let fecha_emision = tarjeta.fecha_emision;
        let fecha_vencimiento = tarjeta.fecha_vencimiento;

        if (fecha_emision && fecha_emision.includes('T')) {
          fecha_emision = fecha_emision.split('T')[0];
        }
        if (fecha_vencimiento && fecha_vencimiento.includes('T')) {
          fecha_vencimiento = fecha_vencimiento.split('T')[0];
        }

        this.form.patchValue({
          ...tarjeta,
          fecha_emision,
          fecha_vencimiento,
        });
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo cargar la tarjeta';
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

    const valores = this.form.value as Partial<Tarjeta>;

    const obs =
      this.esEdicion && this.idTarjeta
        ? this.tarjetasService.updateTarjeta(this.idTarjeta, valores)
        : this.tarjetasService.createTarjeta(valores);

    obs.subscribe({
      next: () => {
        this.guardando = false;
        const mensaje = this.esEdicion
          ? 'Tarjeta actualizada correctamente'
          : 'Tarjeta creada correctamente';
        window.alert(mensaje);
        this.router.navigate(['/tarjetas']);
      },
      error: () => {
        this.error = 'Error al guardar la tarjeta';
        this.guardando = false;
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/tarjetas']);
  }
}
