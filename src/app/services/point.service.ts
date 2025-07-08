import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { Point } from '../model/point';
import { Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class PointService extends CrudService<Point> {


  constructor(firestore: Firestore) {
    
    super(firestore,  'points')


  }


}
