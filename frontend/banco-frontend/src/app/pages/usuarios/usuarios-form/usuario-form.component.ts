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
  UsuariosService,
  UsuarioSistema,
  EstadoUsuario,
} from '../../../services/usuarios.service';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.scss'],
})
export class UsuarioFormComponent implements OnInit {
  form!: FormGroup;
  cargando = false;
  guardando = false;
  error: string | null = null;
  esEdicion = false;
  idUsuario: string | null = null;

  estados: EstadoUsuario[] = ['activo', 'inactivo', 'bloqueado'];

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      cliente_id: [''],
      username: ['', [Validators.required, Validators.maxLength(50)]],
      rol_id: ['', [Validators.required, Validators.maxLength(36)]],
      estado: ['activo', Validators.required],
      intentos_fallidos: [0, [Validators.required, Validators.min(0)]],
      password: [''], // solo front; se mapea a password_hash
    });

    this.idUsuario = this.route.snapshot.paramMap.get('id');
    this.esEdicion = !!this.idUsuario;

    if (this.esEdicion && this.idUsuario) {
      this.cargarUsuario(this.idUsuario);
    } else {
      // en creación, password obligatorio
      this.form
        .get('password')
        ?.setValidators([Validators.required, Validators.minLength(4)]);
      this.form.get('password')?.updateValueAndValidity();
    }
  }

  tieneError(campo: string, tipo: string): boolean {
    const control = this.form.get(campo);
    return !!control && control.hasError(tipo) && control.touched;
  }

  cargarUsuario(id: string): void {
    this.cargando = true;
    this.usuariosService.getUsuario(id).subscribe({
      next: (usuario) => {
        this.form.patchValue({
          cliente_id: usuario.cliente_id,
          username: usuario.username,
          rol_id: usuario.rol_id,
          estado: usuario.estado,
          intentos_fallidos: usuario.intentos_fallidos,
          password: '',
        });

        // en edición, la password es opcional
        this.form.get('password')?.clearValidators();
        this.form.get('password')?.updateValueAndValidity();

        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el usuario del sistema';
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

    const valores = this.form.value as {
      cliente_id: string;
      username: string;
      rol_id: string;
      estado: EstadoUsuario;
      intentos_fallidos: number;
      password: string;
    };

    const payload: Partial<UsuarioSistema> = {
      cliente_id: valores.cliente_id || null,
      username: valores.username,
      rol_id: valores.rol_id,
      estado: valores.estado,
      intentos_fallidos: Number(valores.intentos_fallidos) || 0,
    };

    if (valores.password && valores.password.trim() !== '') {
      payload.password_hash = valores.password;
    }

    const obs =
      this.esEdicion && this.idUsuario
        ? this.usuariosService.updateUsuario(this.idUsuario, payload)
        : this.usuariosService.createUsuario(payload);

    obs.subscribe({
      next: () => {
        this.guardando = false;
        const mensaje = this.esEdicion
          ? 'Usuario actualizado correctamente'
          : 'Usuario creado correctamente';
        window.alert(mensaje);
        this.router.navigate(['/usuarios']);
      },
      error: () => {
        this.error = 'Error al guardar el usuario del sistema';
        this.guardando = false;
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/usuarios']);
  }
}
