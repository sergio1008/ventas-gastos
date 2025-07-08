import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { UserCredential } from 'firebase/auth';
import { AngularFireFunctionsModule } from '@angular/fire/compat/functions';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FormsModule, PasswordModule, FloatLabelModule, CardModule, ButtonModule, InputTextModule, AngularFireFunctionsModule],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  formLogin: FormGroup
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.formLogin = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  async login() {
   
    this.authService.login(this.formLogin.controls['username'].value, this.formLogin.controls['password'].value).subscribe(
      {
        next: (userCredential: UserCredential) => {
          this.router.navigate(['/pos'])
        },
        error: (error) => {
          console.error('Error de login:', error);
          // Muestra un mensaje de error al usuario
        }
      }
    );
  }
}
