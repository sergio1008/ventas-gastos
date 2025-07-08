import { Component, OnInit } from '@angular/core';
import { ImportsModule } from '../../../imports';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { PointService } from '../../../services/point.service';
import { navigate } from '../../../util/navigate.util';

@Component({
  selector: 'app-point-create',
  imports: [ImportsModule],
  templateUrl: './point-create.component.html',
  styleUrl: './point-create.component.css'
})
export class PointCreateComponent implements OnInit{

navegar(path: string) {
  navigate(this.router, path);
}
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  formPoint: FormGroup;

  constructor(private fb: FormBuilder, private messageService: MessageService, private pointService: PointService, private router: Router) {
    this.formPoint = this.fb.group({
      name: ['', [Validators.required]],
      actived: [false, [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.items = [
      { label: 'POS',  command: () => this.navegar('/pos')  },
      { label: 'Puntos', command: () => this.navegar('/pos/puntos') },
      { label: 'Crear punto', disabled: true }
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }
async createPoint() {
  const result = await this.pointService.create(this.formPoint.value);
  
  if(result){
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Se ha creado el punto' });
    this.formPoint.reset();
  } else {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se ha creado el punto' });
  }
}




}
