import { CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const role = localStorage.getItem('role')

  if(role == 'admin'){
    return true;
  }else {
    return false;
  }
  
};
