import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Product } from '../model/product';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService  extends CrudService<Product> {


  constructor(firestore: Firestore) {
    
    super(firestore, 'products')


  }


}
