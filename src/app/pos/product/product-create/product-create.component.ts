import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ImportsModule } from '../../../imports';
import { ProductService } from '../../../services/product.service';
import { StorageService } from '../../../services/storage.service';
import { LoadingService } from '../../../services/util/loading.service';
import { navigate } from '../../../util/navigate.util';
@Component({
  selector: 'app-product-create',
  imports: [ImportsModule],
  templateUrl: './product-create.component.html',
  providers: [],
  styleUrl: './product-create.component.css'
})
export class ProductCreateComponent implements OnInit {

  @ViewChild('fu') fileUploader!: ElementRef;

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  formProduct: FormGroup;

  constructor(private fb: FormBuilder, private messageService: MessageService, private productService: ProductService,
     private storage: StorageService, private router: Router, private loadingService: LoadingService) {
    this.formProduct = this.fb.group({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      description: [''],
      quantity: ['', [Validators.required]],
      price: [0, [Validators.required]],
      favorite: new FormControl(false),
      image: [null]
    })
  }
  ngOnInit(): void {
    this.items = [
      { label: 'POS', command: () => navigate(this.router, '/pos') },
      { label: 'Productos', command: () => navigate(this.router, '/pos/productos') },
      { label: 'Crear producto', disabled: true }
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }


  async createProduct() {
    this.loadingService.show();
    if (this.formProduct.get('image')?.value != null) {
      this.storage.uploadImagen(this.formProduct.get('image')?.value, this.formProduct.get('image')?.value.name).subscribe(async (url) => {
        this.formProduct.get('image')?.setValue(url);

        const { name, code, description, quantity, price, favorite, image } = this.formProduct.value;
        const dataForm = { name, code, description, quantity, price, favorite: favorite[0] == 'true' ? true : false, image };

        const result = await this.productService.create(dataForm);

        if (result) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Se ha creado el producto' });
          this.formProduct.reset();
          this.fileUploader.nativeElement.value = null;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se ha creado el producto' });
        }
      });
    } else {
      const { name, code, description, quantity, price, favorite } = this.formProduct.value;
      const dataForm = { name, code, description, quantity, price, favorite: favorite[0] && favorite[0] == 'true' ? true : false };

      const result = await this.productService.create(dataForm);

      if (result) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Se ha creado el producto' });
        this.formProduct.reset();
        this.fileUploader.nativeElement.value = null;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se ha creado el producto' });
      }
    }

    this.loadingService.hide();


  }

  onUpload(event: any) {
    const file = event.target.files[0];
    this.formProduct.get('image')?.setValue(file);
  }

  navegar(ruta: string) {
    navigate(this.router, ruta);
  }
}
