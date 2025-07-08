import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { User } from '../model/user';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends CrudService<User> {

  constructor(private firebase: Firestore) {
      super(firebase, 'users')
   }
}
