import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ImportsModule } from '../../../imports';
import { Product } from '../../../model/product';
import { Column } from '../../../model/util/column';
import { ProductService } from '../../../services/product.service';
import { StorageService } from '../../../services/storage.service';
import { Like } from '../../../services/util/like';
import { navigate } from '../../../util/navigate.util';

@Component({
  selector: 'app-product-list',
  imports: [ImportsModule],
  providers: [MessageService, StorageService],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit{
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  products!: Product[]
  lastProduct: QueryDocumentSnapshot<Product> | null = null
  selectedProducts!: Product[] | null;
  page = 0
  size = 20
  total = 0
  showFirst = false
  showLast = false

  columns: Column[] = [
    { field: 'name', header: 'Nombre producto' },
    { field: 'code', header: 'Código' },
    { field: 'price', header: 'Precio' },
    { field: 'quantity', header: 'Cantidad' },
    { field: 'favorite', header: 'Favorito', align: 'text-center' },
  ]

  formFiltro: FormGroup

  constructor(private fb: FormBuilder,
    private productService: ProductService,
    private router: Router, private http: HttpClient,
    private messageService: MessageService, private storageService: StorageService) {

    this.formFiltro = this.fb.group({
      name: ['', [Validators.min(3)]],
    });

  }

  ngOnInit() {
    this.items = [
      { label: 'POS' },
      { label: 'Productos' },
      { label: 'Listar producto' }
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };


  }


  search() {
    this.page = 0;
    this.total = 0;
    this.products = [];

    let like: Like[] = [];
    if (this.formFiltro.value.name != null && this.formFiltro.value.name != '') {
      like = [{ field: 'name', value: this.formFiltro.value.name }];
    } 

    if (this.formFiltro.controls['name'].value != null && this.formFiltro.controls['name'].value != '') {
      this.productService.find(this.page!, this.size, [{ field: 'name', direction: 'asc' }], [], null, null, like).subscribe((data) => {
        this.products = data.content;
        this.lastProduct = data.lastReference;
        this.page = data.page;
        this.total = data.totalElementos;
      });

    } else {
      this.productService.find(this.page!, this.size, [{ field: 'name', direction: 'asc' }], [], null, null, []).subscribe((data) => {
        this.products = data.content;
        this.lastProduct = data.lastReference;
        this.page = data.page;
        this.total = data.totalElementos;
      });
    }
  }

  getData(event: any) {
    let like: Like[] = [];
    if (this.formFiltro.value.name != null && this.formFiltro.value.name != '') {
      like = [{ field: 'name', value: this.formFiltro.value.name }];
    } 


    if (event.first == 0) {
      this.page = event.first;
      this.productService.find(this.page!, this.size, [{ field: 'name', direction: 'asc' }], [], null, null ,like).subscribe((data) => {
        this.products = data.content;
        this.lastProduct = data.lastReference;
        this.page = data.page;
        this.total = data.totalElementos;

      });
    } else if (event.first >= this.page) {
      this.page = event.first;
      this.productService.find(this.page!, this.size, [{ field: 'name', direction: 'asc' }], [], 'next', this.lastProduct, like).subscribe((data) => {
        this.products = data.content;
        this.lastProduct = data.lastReference;
        this.page = data.page;
        this.total = data.totalElementos;

      });
    } else {
      this.page = event.first;
      this.productService.find(this.page!, this.size, [{ field: 'name', direction: 'asc' }], [], 'previous', this.lastProduct, like).subscribe((data) => {
        this.products = data.content;
        this.lastProduct = data.lastReference;
        this.page = data.page;
        this.total = data.totalElementos;

      });
    }
  }

  deleteProduct(product: Product) {
    this.productService.deleteDocumentById(product.id!).subscribe(() => {

      if (product.image != null && product.image != '') {
        this.storageService.deleteFile(product.image).subscribe(() => {
          this.messageService.add({ severity: 'info', summary: 'Exito', detail: 'Se ha borrado el producto' });
        });

      } else {
        this.messageService.add({ severity: 'info', summary: 'Exito', detail: 'Se ha borrado el producto' });
      }

      this.page = 0;

      this.productService.find(this.page!, this.size, [{ field: 'name', direction: 'asc' }], [], null, null, []).subscribe((data) => {
        this.products = data.content;
        this.lastProduct = data.lastReference;
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


