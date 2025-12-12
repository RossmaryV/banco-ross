import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClientesService, Cliente } from '../../../services/clientes.service';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.scss'],
})
export class ClienteFormComponent implements OnInit {
  form!: FormGroup;
  cargando = false;
  guardando = false;
  error: string | null = null;
  esEdicion = false;
  idCliente: string | null = null;

  tiposIdentificacion = ['cedula', 'ruc', 'pasaporte'];
  estados = ['activo', 'inactivo', 'pendiente_verificacion'];

  constructor(
    private fb: FormBuilder,
    private clientesService: ClientesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
  tipo_identificacion: ['', Validators.required],

  // solo números
  numero_identificacion: [
    '',
    [Validators.required, Validators.pattern(/^[0-9]+$/)],
  ],

  // solo letras y espacios
  nombres: [
    '',
    [
      Validators.required,
      Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/),
    ],
  ],
  apellidos: [
    '',
    [
      Validators.required,
      Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/),
    ],
  ],

  fecha_nacimiento: [''],
  nacionalidad: ['paraguaya'],
  direccion: [''],
  departamento: [''],
  distrito: [''],
  ciudad: [''],

  // solo dígitos opcionales
  telefono: ['', [Validators.pattern(/^[0-9]*$/)]],

  email: ['', [Validators.email]],
  estado: ['activo'],
});


    this.idCliente = this.route.snapshot.paramMap.get('id');
    this.esEdicion = !!this.idCliente;

    if (this.esEdicion && this.idCliente) {
      this.cargarCliente(this.idCliente);
    }
  }
  tieneError(campo: string, tipo: string): boolean {
  const control = this.form.get(campo);
  return !!control && control.hasError(tipo) && control.touched;
}


  cargarCliente(id: string): void {
    this.cargando = true;
    this.clientesService.getCliente(id).subscribe({
      next: (cliente) => {
        // adaptamos fecha si viene con hora
        let fecha_nacimiento = cliente.fecha_nacimiento;
        if (fecha_nacimiento && fecha_nacimiento.includes('T')) {
          fecha_nacimiento = fecha_nacimiento.split('T')[0];
        }

        this.form.patchValue({
          ...cliente,
          fecha_nacimiento,
        });
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el cliente';
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

    const valores = this.form.value as Partial<Cliente>;

    const obs = this.esEdicion && this.idCliente
      ? this.clientesService.updateCliente(this.idCliente, valores)
      : this.clientesService.createCliente(valores);

    obs.subscribe({
  next: () => {
    this.guardando = false;
    const mensaje = this.esEdicion
      ? 'Cliente actualizado correctamente'
      : 'Cliente creado correctamente';
    window.alert(mensaje); // aviso simple
    this.router.navigate(['/clientes']);
  },
  error: () => {
    this.error = 'Error al guardar el cliente';
    this.guardando = false;
  },
});

  }

  cancelar(): void {
    this.router.navigate(['/clientes']);
  }
  
}
