import { Component, OnInit, Inject } from '@angular/core';
import { SignosVitales } from 'src/app/_model/signosVitales';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SignosVitalesService } from 'src/app/_service/signos-vitales.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-signos-dialogo',
  templateUrl: './signos-dialogo.component.html',
  styleUrls: ['./signos-dialogo.component.css']
})
export class SignosDialogoComponent implements OnInit {

  signos: SignosVitales;

  constructor(
    private dialogRef: MatDialogRef<SignosDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: SignosVitales,
    private signosServicio: SignosVitalesService
  ) { }

  ngOnInit(): void {
    this.signos = new SignosVitales();
    this.signos.idSignos = this.data.idSignos;
    this.signos.paciente = this.data.paciente;
    this.signos.fecha = this.data.fecha;
    this.signos.temperatura = this.data.temperatura;
    this.signos.pulso = this.data.pulso;
    this.signos.ritmo = this.data.ritmo;
  }

  operar() {
    if (this.signos != null && this.signos.idSignos > 0) {
      //MODIFICAR
      this.signosServicio.modificar(this.signos).pipe(switchMap(() => {
        return this.signosServicio.listar();
      })).subscribe(data => {
        this.signosServicio.setSignosCambio(data);
        this.signosServicio.setMensajeCambio('SE MODIFICO');
      });
    } else {
      //REGISTRAR
      //REGISTRAR
      this.signosServicio.registrar(this.signos).pipe(switchMap(() => {
        return this.signosServicio.listar();
      })).subscribe(data => {
        this.signosServicio.setSignosCambio(data);
        this.signosServicio.setMensajeCambio('SE REGISTRO');
      });
    }
    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close();
  }
}

