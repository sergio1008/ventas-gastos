import { Component, OnInit } from '@angular/core';
import { ImportsModule } from '../../../imports';
import { MenuItem, MessageService } from 'primeng/api';
import { navigate } from '../../../util/navigate.util';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { LoadingService } from '../../../services/util/loading.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-create',
  imports: [ImportsModule],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css'
})
export class UserCreateComponent implements OnInit {
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  formUser: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService,
    private messageService: MessageService,  private loadingService: LoadingService, private userService: UserService) {
    this.formUser = this.fb.group({

      id: [undefined],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      fullname: ['', [Validators.required]],
      phoneNumber: ['', Validators.required],
      password: ['', Validators.required],

    })
  }

  ngOnInit(): void {
    this.items = [
      { label: 'POS', command: () => navigate(this.router, '/pos') },
      { label: 'Usuarios', command: () => navigate(this.router, '/pos/usuarios') },
      { label: 'Crear usuario', disabled: true }
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }

  async createUser() {

    this.loadingService.show();

    this.authService.createUser(this.formUser.value).subscribe({
      next: async (data) => {
        if (data.data) {
          await this.userService.create(this.formUser.value);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Se ha creado el usuario con éxito' });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Success', detail: 'Ha ocurrido un error al crear el usuario' });
        }

      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Success', detail: 'Ha ocurrido un error al crear el usuario' });
      },
      complete: () => {
        this.formUser.reset();
        this.loadingService.hide();
      }
    });
  }

  navegar(path: string) {
    navigate(this.router, path)
  }

}
