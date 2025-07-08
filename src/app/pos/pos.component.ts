import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ImportsModule } from '../imports';
import { navigate } from '../util/navigate.util';
import { LoadingBarComponent } from "../util/loading-bar/loading-bar.component";
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-pos',
  imports: [ImportsModule, RouterOutlet, LoadingBarComponent],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.css'
})
export class PosComponent implements OnInit {

    logout() {
        this,this.authService.logout().subscribe(() => {
            navigate(this.router, '/auth/login')
        })
    }
    hideMenu = false;
  
  items: MenuItem[] | undefined;
  sidebarVisible = true

  constructor(private router: Router, private authService: AuthService){

  }
  ngOnInit() {


    this.items = [
      {
          separator: true
      },
      {
          label: 'Ventas',
          items: [
              {
                  label: 'Generar ventas',
                  icon: 'pi pi-shop',
                  command: () => navigate(this.router, '/pos/ventas'),        
              },
              {
                  label: 'Reportes',
                  icon: 'pi pi-file-excel'
              }
          ]
      },
      {
        separator: true
    },
    {
        label: 'Gastos',
        items: [
            {
                label: 'Generar gastos',
                icon: 'pi pi-dollar'
            },
            {
                label: 'Reportes',
                icon: 'pi pi-file-excel'
            }
        ]
    },
      {
          label: 'Configuraciòn',
          items: [
              {
                  label: 'Productos / Servicios',
                  icon: 'pi pi-tags',
                  command: () => navigate(this.router, '/pos/productos'),        
              },
              {
                label: 'Caja',
                icon: 'pi pi-money-bill',
                command: () => navigate(this.router, '/pos/caja'), 
              },
              {
                label: 'Usuarios',
                icon: 'pi pi-users',
                command: () => navigate(this.router, '/pos/usuarios'), 
              },              
              {
                label: 'Puntos',
                icon: 'pi pi-shopping-cart',
                command: () => navigate(this.router, '/pos/puntos'), 
              },

              {
                  label: 'Salir',
                  icon: 'pi pi-sign-out',
                  command: () => this.logout()
              },

          ]
      },
      {
          separator: true
      }
  ];
  }

  toggleSidebar() {

  }
}
