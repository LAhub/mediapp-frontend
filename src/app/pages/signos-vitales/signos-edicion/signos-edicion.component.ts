import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { SignosVitalesService } from 'src/app/_service/signos-vitales.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { switchMap, map } from 'rxjs/operators';
import { SignosVitales } from 'src/app/_model/signosVitales';
import { PacienteService } from 'src/app/_service/paciente.service';
import { Paciente } from 'src/app/_model/paciente';
import { Observable } from 'rxjs';
import { PacienteNuevoComponent } from '../paciente-nuevo/paciente-nuevo.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-signos-edicion',
  templateUrl: './signos-edicion.component.html',
  styleUrls: ['./signos-edicion.component.css']
})
export class SignosEdicionComponent implements OnInit {

  form: FormGroup;
  id: number;
  edicion: boolean;
  maxFecha: Date = new Date();
  pacienteSeleccionado: Paciente;
  dataPaciente: Paciente[] = [];
  flagEdicion: boolean = false;

  pacientesFiltrados$: Observable<Paciente[]>;
  pacienteForm: FormControl = new FormControl();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private signosService: SignosVitalesService,
    private pacienteService: PacienteService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.listarPacientes();
    this.inicializarForm();

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
    });

    this.pacientesFiltrados$ = this.pacienteForm.valueChanges.pipe(map(val => this.filtrarPacientes(val)));
  }

  mostrarPaciente(val: Paciente) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  filtrarPacientes(val: any){
    if (val != null && val.idPaciente > 0) {
      return this.dataPaciente.filter(el =>
        el.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || el.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || el.dni.includes(val.dni)
      );
    }
    return this.dataPaciente.filter(el =>
      el.nombres.toLowerCase().includes(val?.toLowerCase()) || el.apellidos.toLowerCase().includes(val?.toLowerCase()) || el.dni.includes(val)
    );
  }

  inicializarForm() {
    this.form = this.formBuilder.group({
      'id': new FormControl(0),
      // cboPaciente: new FormControl(''),
      // 'cboPaciente': null,
      'paciente' : this.pacienteForm,
      'nombrePaciente': new FormControl({ value: '', disabled: true }),
      'fecha': ['', new FormControl(new Date(), [Validators.required])],
      'temperatura': new FormControl(''),
      'pulso': new FormControl(''),
      'ritmo': new FormControl('')
    });
  }

  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.dataPaciente = data;
    });
  }

  private initForm() {
    if (this.edicion) {
      this.flagEdicion = true;
      this.signosService.listarPorId(this.id).subscribe(data => {

        this.dataPaciente.forEach(tmpData => {
          if (tmpData.idPaciente === data.paciente.idPaciente) {
            this.pacienteSeleccionado = data.paciente;
          }
        });

        this.inicializarForm();

        this.form.patchValue(
          {
            id: data.idSignos,
            nombrePaciente: `${this.pacienteSeleccionado.nombres} ${this.pacienteSeleccionado.apellidos}`,
            fecha: data.fecha,
            temperatura: data.temperatura,
            pulso: data.pulso,
            ritmo: data.ritmo
          });
      });
    } else {
      this.flagEdicion = false;
    }
  }

  get f() {
    return this.form.controls;
  }

  operar() {
    if (this.form.invalid) { return; }

    let signosData = new SignosVitales();
    signosData.idSignos = this.form.value['id'];
    signosData.paciente = this.pacienteForm.value;
    signosData.fecha = this.form.value['fecha'];
    signosData.temperatura = this.form.value['temperatura'];
    signosData.pulso = this.form.value['pulso'];
    signosData.ritmo = this.form.value['ritmo'];

    if (this.edicion) {
      //PRACTICA IDEAL
      this.signosService.modificar(signosData).pipe(switchMap(() => {
        return this.signosService.listar();
      }))
        .subscribe(data => {
          this.signosService.setSignosCambio(data);
          this.signosService.setMensajeCambio('SE MODIFICO');
        });

    } else {
      //REGISTRAR
      this.signosService.registrar(signosData).subscribe(() => {
        this.signosService.listar().subscribe(data => {
          this.signosService.setSignosCambio(data);
          this.signosService.setMensajeCambio('SE REGISTRO');
        });
      });
    }

    this.router.navigate(['signos-vitales']);

  }

  seleccionarPaciente(e: any) {
    this.pacienteSeleccionado = e.value;
  }

  abrirDialogo() {
    this.dialog.open(PacienteNuevoComponent, {
      width: '250px',
      data: null
    });
  }

}
