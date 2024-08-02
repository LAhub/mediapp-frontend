import { Component, OnInit } from '@angular/core';
import { PacienteService } from 'src/app/_service/paciente.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Paciente } from 'src/app/_model/paciente';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-paciente-nuevo',
  templateUrl: './paciente-nuevo.component.html',
  styleUrls: ['./paciente-nuevo.component.css']
})
export class PacienteNuevoComponent implements OnInit {

  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<PacienteNuevoComponent>,
    private pacienteService: PacienteService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombres': new FormControl(''),
      'apellidos': new FormControl(''),
      'dni': new FormControl(''),
      'telefono': new FormControl(''),
      'direccion': new FormControl(''),
    });
  }

  get f() {
    return this.form.controls;
  }

  operar() {
    if (this.form.invalid) { return; }

    let paciente = new Paciente();
    paciente.idPaciente = this.form.value['id'];
    paciente.nombres = this.form.value['nombres'];
    paciente.apellidos = this.form.value['apellidos'];
    paciente.dni = this.form.value['dni'];
    paciente.telefono = this.form.value['telefono'];
    paciente.direccion = this.form.value['direccion'];

    //REGISTRAR
    this.pacienteService.registrar(paciente).subscribe(data => {
      console.log('data registrada', data);
      this.pacienteService.setMensajeCambio('SE REGISTRO');
    });

    this.router.navigate(['signos-vitales']);
    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }

}

