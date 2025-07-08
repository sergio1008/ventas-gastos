import { Component, OnInit } from '@angular/core';
import { ImportsModule } from '../../../imports';
import { MenuItem, MessageService } from 'primeng/api';
import {navigate} from '../../../util/navigate.util';
import { Router } from '@angular/router';
import { Point } from '../../../model/point';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Column } from '../../../model/util/column';
import { TableLazyLoadEvent } from 'primeng/table';
import { PointService } from '../../../services/point.service';
@Component({
  selector: 'app-point-list',
  imports: [ImportsModule],
  templateUrl: './point-list.component.html',
  styleUrl: './point-list.component.css',
  providers: [MessageService]
})
export class PointListComponent implements OnInit {


  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  products!: Point[]
    lastPoint: QueryDocumentSnapshot<Point> | null = null
    selectedProducts!: Point[] | null;
    page = 0
    size = 20
    total = 0
    showFirst = false
    showLast = false
  
    columns: Column[] = [
      { field: 'name', header: 'Nombre del punto' },
      { field: 'actived', header: 'Activo' }
    ]
  
  constructor(private router: Router, private messageService: MessageService, private pointService: PointService) { }

  ngOnInit() {
    this.items = [
      { label: 'POS', command: () =>  navigate(this.router, '/pos')  },
      { label: 'Puntos', command: () =>  navigate(this.router, '/pos/puntos') },
      { label: 'Listar puntos' }
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }


  
deletePoint(_t44: any) {
  throw new Error('Method not implemented.');
  }
  navegar(path: string) {
    navigate(this.router, path);
  }
  getData($event: TableLazyLoadEvent) {
    this.pointService.find(this.page!, this.size, [{ field: 'name', direction: 'asc' }], [], 'next', this.lastPoint, []).subscribe((data) => {
      this.products = data.content;
      this.lastPoint = data.lastReference;
      this.page = data.page;
      this.total = data.totalElementos;
  
    });
  }
}
