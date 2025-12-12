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
  ServiciosService,
  Servicio,
  TipoServicio,
} from '../../../services/servicios.service';

@Component({
  selector: 'app-servicio-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './servicio-form.component.html',
  styleUrls: ['./servicio-form.component.scss'],
})
export class ServicioFormComponent implements OnInit {
  form!: FormGroup;
  cargando = false;
  guardando = false;
  error: string | null = null;
  esEdicion = false;
  idServicio: string | null = null;

  tipos: TipoServicio[] = ['luz', 'agua', 'telefonia', 'impuestos'];
  estados = ['activo', 'inactivo'];

  constructor(
    private fb: FormBuilder,
    private serviciosService: ServiciosService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre_servicio: ['', [Validators.required, Validators.maxLength(150)]],
      codigo_servicio: ['', [Validators.required, Validators.maxLength(50)]],
      tipo_servicio: ['', Validators.required],
      estado: ['activo', Validators.required],
    });

    this.idServicio = this.route.snapshot.paramMap.get('id');
    this.esEdicion = !!this.idServicio;

    if (this.esEdicion && this.idServicio) {
      this.cargarServicio(this.idServicio);
    }
  }

  tieneError(campo: string, tipo: string): boolean {
    const control = this.form.get(campo);
    return !!control && control.hasError(tipo) && control.touched;
  }

  cargarServicio(id: string): void {
    this.cargando = true;
    this.serviciosService.getServicio(id).subscribe({
      next: (servicio) => {
        this.form.patchValue(servicio);
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el servicio';
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

    const valores = this.form.value as Partial<Servicio>;

    const obs =
      this.esEdicion && this.idServicio
        ? this.serviciosService.updateServicio(this.idServicio, valores)
        : this.serviciosService.createServicio(valores);

    obs.subscribe({
      next: () => {
        this.guardando = false;
        const mensaje = this.esEdicion
          ? 'Servicio actualizado correctamente'
          : 'Servicio creado correctamente';
        window.alert(mensaje);
        this.router.navigate(['/servicios']);
      },
      error: () => {
        this.error = 'Error al guardar el servicio';
        this.guardando = false;
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/servicios']);
  }
}
