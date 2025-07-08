import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QueryDocumentSnapshot } from '@firebase/firestore';
import { MenuItem, MessageService } from 'primeng/api';
import { ImportsModule } from '../../../imports';
import { Product } from '../../../model/product';
import { User } from '../../../model/user';
import { Column } from '../../../model/util/column';
import { StorageService } from '../../../services/storage.service';
import { UserService } from '../../../services/user.service';
import { Like } from '../../../services/util/like';
import { navigate } from '../../../util/navigate.util';

@Component({
  selector: 'app-user-list',
  imports: [ImportsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  users!: User[]
  lastUser: QueryDocumentSnapshot<User> | null = null
  selectedProducts!: Product[] | null;
  page = 0
  size = 20
  total = 0
  showFirst = false
  showLast = false

  columns: Column[] = [
    { field: 'fullname', header: 'Nombre completo' },
    { field: 'email', header: 'Correo' }
  ]

  formFiltro: FormGroup

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private router: Router, private http: HttpClient,
    private messageService: MessageService, private storageService: StorageService) {

    this.formFiltro = this.fb.group({
      fullname: ['', [Validators.min(3)]],
    });

  }

  ngOnInit() {
    this.items = [
      { label: 'POS', command: () => navigate(this.router, '/pos')},
      { label: 'Usuarios', command: () => navigate(this.router, '/pos/usuarios') },
      { label: 'Listar usuarios' }
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };


  }


  search() {
    this.page = 0;
    this.total = 0;
    this.users = [];

    let like: Like[] = [];
    if (this.formFiltro.value.fullname != null && this.formFiltro.value.fullname != '') {
      like = [{ field: 'fullname', value: this.formFiltro.value.fullname }];
    } 

    if (this.formFiltro.controls['fullname'].value != null && this.formFiltro.controls['fullname'].value != '') {
      this.userService.find(this.page!, this.size, [{ field: 'fullname', direction: 'asc' }], [], null, null, like).subscribe((data) => {
        this.users = data.content;
        this.lastUser = data.lastReference;
        this.page = data.page;
        this.total = data.totalElementos;
      });

    } else {
      this.userService.find(this.page!, this.size, [{ field: 'fullname', direction: 'asc' }], [], null, null, []).subscribe((data) => {
        this.users = data.content;
        this.lastUser = data.lastReference;
        this.page = data.page;
        this.total = data.totalElementos;
      });
    }
  }

  getData(event: any) {
    let like: Like[] = [];
    if (this.formFiltro.value.fullname != null && this.formFiltro.value.fullname != '') {
      like = [{ field: 'fullname', value: this.formFiltro.value.fullname }];
    } 


    if (event.first == 0) {
      this.page = event.first;
      this.userService.find(this.page!, this.size, [{ field: 'fullname', direction: 'asc' }], [], null, null ,like).subscribe((data) => {
        this.users = data.content;
        this.lastUser = data.lastReference;
        this.page = data.page;
        this.total = data.totalElementos;

      });
    } else if (event.first >= this.page) {
      this.page = event.first;
      this.userService.find(this.page!, this.size, [{ field: 'fullname', direction: 'asc' }], [], 'next', this.lastUser, like).subscribe((data) => {
        this.users = data.content;
        this.lastUser = data.lastReference;
        this.page = data.page;
        this.total = data.totalElementos;

      });
    } else {
      this.page = event.first;
      this.userService.find(this.page!, this.size, [{ field: 'fullname', direction: 'asc' }], [], 'previous', this.lastUser, like).subscribe((data) => {
        this.users = data.content;
        this.lastUser = data.lastReference;
        this.page = data.page;
        this.total = data.totalElementos;

      });
    }
  }

  deleteUser(product: Product) {
    this.userService.deleteDocumentById(product.id!).subscribe(() => {

      if (product.image != null && product.image != '') {
        this.storageService.deleteFile(product.image).subscribe(() => {
          this.messageService.add({ severity: 'info', summary: 'Exito', detail: 'Se ha borrado el usuario con exito' });
        });

      } else {
        this.messageService.add({ severity: 'info', summary: 'Exito', detail: 'Se ha borrado el producto' });
      }

      this.page = 0;

      this.userService.find(this.page!, this.size, [{ field: 'fullname', direction: 'asc' }], [], null, null, []).subscribe((data) => {
        this.users = data.content;
        this.lastUser = data.lastReference;
        this.page = data.page;
        this.total = data.totalElementos;
      });

    });

  }



  navegar(ruta: string) {
    navigate(this.router, ruta);
  }

  exportCSV($event: any) {

  }
}
