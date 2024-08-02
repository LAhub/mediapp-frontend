import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SignosVitales } from 'src/app/_model/signosVitales';
import { MatTableDataSource } from '@angular/material/table';
import { SignosVitalesService } from 'src/app/_service/signos-vitales.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-signos-vitales',
  templateUrl: './signos-vitales.component.html',
  styleUrls: ['./signos-vitales.component.css']
})
export class SignosVitalesComponent implements OnInit {

  displayedColumns = ['idSignos', 'paciente', 'fecha', 'temperatura', 'pulso', 'ritmo', 'acciones'];
  dataSource: MatTableDataSource<SignosVitales>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  cantidad: number = 0;

  constructor(
    private signosService: SignosVitalesService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.signosService.listarPageable(0, 10).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    })

    this.signosService.getSignosCambio().subscribe(data => {
      this.crearTabla(data);
    });

    this.signosService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });

  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  crearTabla(data: SignosVitales[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  mostrarMas(e: any) {
    this.signosService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }

  eliminar(dataSignos: SignosVitales) {
    this.signosService.eliminar(dataSignos.idSignos).pipe(switchMap(() => {
      return this.signosService.listar();
    })).subscribe(data => {
      this.signosService.setSignosCambio(data);
      this.signosService.setMensajeCambio('SE ELIMNO');
    });
  }

}
