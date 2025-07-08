import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Order } from '../model/order';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService  extends CrudService<Order> {


  constructor(firestore: Firestore) {
    
    super(firestore,  'orders')


  }


}