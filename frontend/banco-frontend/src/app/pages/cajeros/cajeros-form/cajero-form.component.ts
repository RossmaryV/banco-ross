import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  CajerosService,
  Cajero,
  EstadoCajero,
} from '../../../services/cajeros.service';

@Component({
  selector: 'app-cajero-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './cajero-form.component.html',
  styleUrls: ['./cajero-form.component.scss'],
})
export class CajeroFormComponent implements OnInit {
  form!: FormGroup;
  cargando = false;
  guardando = false;
  error: string | null = null;
  esEdicion = false;
  idCajero: string | null = null;

  estados: EstadoCajero[] = ['operativo', 'mantenimiento', 'fuera_servicio'];

  constructor(
    private fb: FormBuilder,
    private cajerosService: CajerosService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      codigo_cajero: ['', [Validators.required, Validators.maxLength(50)]],
      ubicacion: ['', [Validators.required, Validators.maxLength(255)]],
      saldo_efectivo_disponible: [0, [Validators.required, Validators.min(0)]],
      denominaciones_disponibles: [''], // texto JSON opcional
      estado: ['operativo', Validators.required],
      fecha_ultimo_abastecimiento: [''],
      fecha_ultimo_mantenimiento: [''],
    });

    this.idCajero = this.route.snapshot.paramMap.get('id');
    this.esEdicion = !!this.idCajero;

    if (this.esEdicion && this.idCajero) {
      this.cargarCajero(this.idCajero);
    }
  }

  tieneError(campo: string, tipo: string): boolean {
    const control = this.form.get(campo);
    return !!control && control.hasError(tipo) && control.touched;
  }

  cargarCajero(id: string): void {
    this.cargando = true;
    this.cajerosService.getCajero(id).subscribe({
      next: (cajero) => {
        let fechaAbast = cajero.fecha_ultimo_abastecimiento;
        let fechaMant = cajero.fecha_ultimo_mantenimiento;

        // adaptar DATETIME a datetime-local
        if (fechaAbast && fechaAbast.includes('T')) {
          fechaAbast = fechaAbast.substring(0, 16);
        }
        if (fechaMant && fechaMant.includes('T')) {
          fechaMant = fechaMant.substring(0, 16);
        }

        this.form.patchValue({
          codigo_cajero: cajero.codigo_cajero,
          ubicacion: cajero.ubicacion,
          saldo_efectivo_disponible: cajero.saldo_efectivo_disponible,
          denominaciones_disponibles:
            typeof cajero.denominaciones_disponibles === 'string'
              ? cajero.denominaciones_disponibles
              : JSON.stringify(cajero.denominaciones_disponibles ?? {}),
          estado: cajero.estado,
          fecha_ultimo_abastecimiento: fechaAbast,
          fecha_ultimo_mantenimiento: fechaMant,
        });

        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el cajero automático';
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

    const valores = this.form.value as any;

    // intentar parsear denominaciones si parece JSON
    if (valores.denominaciones_disponibles) {
      try {
        const parsed = JSON.parse(valores.denominaciones_disponibles);
        valores.denominaciones_disponibles = parsed;
      } catch (_) {
        // si no es JSON válido, lo dejamos como string
      }
    }

    const payload: Partial<Cajero> = {
      codigo_cajero: valores.codigo_cajero,
      ubicacion: valores.ubicacion,
      saldo_efectivo_disponible: Number(valores.saldo_efectivo_disponible),
      denominaciones_disponibles: valores.denominaciones_disponibles,
      estado: valores.estado,
      fecha_ultimo_abastecimiento:
        valores.fecha_ultimo_abastecimiento || null,
      fecha_ultimo_mantenimiento: valores.fecha_ultimo_mantenimiento || null,
    };

    const obs =
      this.esEdicion && this.idCajero
        ? this.cajerosService.updateCajero(this.idCajero, payload)
        : this.cajerosService.createCajero(payload);

    obs.subscribe({
      next: () => {
        this.guardando = false;
        const mensaje = this.esEdicion
          ? 'Cajero actualizado correctamente'
          : 'Cajero creado correctamente';
        window.alert(mensaje);
        this.router.navigate(['/cajeros']);
      },
      error: () => {
        this.error = 'Error al guardar el cajero automático';
        this.guardando = false;
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/cajeros']);
  }
}
